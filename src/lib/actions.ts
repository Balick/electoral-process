"use server";

import { redirect } from "next/navigation";

import adminClient from "@/lib/supabase/adminClient";
import { createClient } from "@/lib/supabase/server";
import { Role } from "@/constants";

type LoginData = {
  email: string;
  password: string;
  target: string;
};

// login function to log in user
export async function login({ email, password, target }: LoginData) {
  const supabase = createClient();
  const data = { email, password };
  let errorMessage = "Erreur lors de la connexion.";

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error.message);

    if (error.message === "Invalid login credentials")
      errorMessage = "Vos identifiants sont incorrects.";

    return errorMessage;
  }

  // verify if user is a manager or an admin
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // if user is a manager and target is admin, return error message
  if (user.role === "manager" && target === "admin") {
    await signOut();
    errorMessage = "Vos identifiants sont incorrects.";
    return errorMessage;
  }

  // if user is an admin and target is center, return error message
  else if (user.role === "admin" && target === "center") {
    await signOut();
    errorMessage = "Vos identifiants sont incorrects.";
    return errorMessage;
  }

  if (user.role === "admin") {
    redirect(`/${target}`);
  } else {
    const { data: center, error: centerError } = await supabase
      .from("centres")
      .select("*")
      .eq("id", user.center_id)
      .single();

    if (centerError) {
      await signOut();
      errorMessage = "Vous n'êtes assigné à aucun centre.";
      return errorMessage;
    }

    redirect(`/${target}/${center.nom}`);
  }
}

// signOut function to log out user
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(`❌  [SignOut Error] ${error.message}`);
  }
}

export async function ResetData() {
  const supabase = createClient();

  const { error: electeursError } = await supabase
    .from("electeurs")
    .update({
      a_vote: false,
      date_vote: null,
      id_candidat: null,
    })
    .neq("id", "c9b383f0-1819-4e65-bdbc-f991e58f383b");

  if (electeursError) {
    console.error(`❌ [ResetData/electeurs] ${electeursError.message}`);
    throw electeursError;
  }

  const { error: candidatsError } = await supabase
    .from("candidates")
    .update({
      a_vote: false,
      date_vote: null,
      total_votes: 0,
    })
    .neq("id", "c9b383f0-1819-4e65-bdbc-f991e58f383b");

  if (candidatsError) {
    console.error(`❌ [ResetData/candidats] ${candidatsError.message}`);
    throw candidatsError;
  }

  const { error: centresError } = await supabase
    .from("centres")
    .update({
      total_votes: 0,
    })
    .neq("id", "c9b383f0-1819-4e65-bdbc-f991e58c384b");

  if (centresError) {
    console.error(`❌ [ResetData/centres] ${centresError.message}`);
    throw centresError;
  }
}

export async function updateManager(
  managerId: string | null,
  props: { email: string; password: string; name: string },
  center_id: string
) {
  const supabase = createClient();
  let shouldCreateUser = managerId ? false : true;
  const { email, password, name } = props;

  // Get the user by ID from the adminClient
  if (!shouldCreateUser && managerId) {
    // Condition pour s'assurer que managerId est une string avant de l'utiliser
    const { error: getUserError } = await adminClient.getUserById(managerId);

    if (getUserError) {
      if (getUserError.message === "User not found") {
        shouldCreateUser = true;
      } else {
        console.error("Erreur auth:", getUserError.message);
        return "Erreur serveur";
      }
    }
  }

  if (shouldCreateUser) {
    // If shouldCreateUser is true, create a new user
    const { data: createdAuthUser, error: createAuthError } =
      await adminClient.createUser({
        email: email,
        password: password,
        user_metadata: {
          name: name,
        },
        email_confirm: true,
      });

    if (createAuthError) {
      console.error(
        `❌  [Error creating auth user] ${createAuthError.message}`
      );
      return "Une erreur s'est produit lors de la création de l'utilisateur.";
    }

    const { error: createUserError } = await supabase.from("users").insert({
      id: createdAuthUser.user.id,
      email: email,
      password: password,
      role: "manager",
      center_id: center_id,
      name: name,
    });

    if (createUserError) {
      console.error(`❌  [Error creating db user] ${createUserError.message}`);
      return "Une erreur s'est produit lors de la création de l'utilisateur.";
    }

    console.log("✅  [Event] Successfully created user. ✨");
  } else {
    // If shouldCreateUser is false, update the user
    if (managerId) {
      // S'assurer encore une fois que managerId n'est pas null avant de l'utiliser ici. Bien que logiquement, il ne devrait pas être null dans ce bloc.
      const { error: updatedAuthError } = await adminClient.updateUserById(
        managerId, // managerId est maintenant garanti d'être une string ici grâce à la condition au-dessus
        {
          email: email,
          password: password,
          user_metadata: {
            name: name,
          },
        }
      );

      if (updatedAuthError) {
        console.error(
          `❌  [Error updating auth user] ${updatedAuthError.message}`
        );
        return "Une erreur s'est produit lors de la mise à jour de l'utilisateur.";
      }

      const { error: updatedUserError } = await supabase
        .from("users")
        .update({
          email: email,
          password: password,
          name: name,
        })
        .eq("id", managerId); // managerId est également garanti d'être une string ici

      if (updatedUserError) {
        console.error(
          `❌  [Error updating db user] ${updatedUserError.message}`
        );
        return "Une erreur s'est produit lors de la mise à jour de l'utilisateur.";
      }

      console.log("✅  [Event] Successfully updated user. ✨");
    } else {
      // Cas improbable, mais pour la robustesse, on gère le cas où managerId serait null dans le bloc 'else'
      console.error(
        "❌ Erreur logique : managerId est null dans le bloc de mise à jour."
      );
      return "Erreur interne : ID de manager manquant pour la mise à jour.";
    }
  }
}

export async function updateUser(
  userID: string | null,
  props: { email: string; password: string; name: string; role: Role }
) {
  const supabase = createClient();
  let shouldCreateUser = userID ? false : true;
  const { email, password, name, role } = props;

  // Get the user by ID from the adminClient
  if (!shouldCreateUser && userID) {
    // Condition pour s'assurer que managerId est une string avant de l'utiliser
    const { error: getUserError } = await adminClient.getUserById(userID);

    if (getUserError) {
      if (getUserError.message === "User not found") {
        shouldCreateUser = true;
      } else {
        console.error("Erreur auth:", getUserError.message);
        return "Erreur serveur";
      }
    }
  }

  if (shouldCreateUser) {
    // If shouldCreateUser is true, create a new user
    const { data: createdAuthUser, error: createAuthError } =
      await adminClient.createUser({
        email: email,
        password: password,
        user_metadata: {
          name: name,
        },
        email_confirm: true,
      });

    if (createAuthError) {
      console.error(
        `❌  [Error creating auth user] ${createAuthError.message}`
      );
      return "Une erreur s'est produit lors de la création de l'utilisateur.";
    }

    const { error: createUserError } = await supabase.from("users").insert({
      id: createdAuthUser.user.id,
      email: email,
      password: password,
      role: role,
      name: name,
    });

    if (createUserError) {
      console.error(`❌  [Error creating db user] ${createUserError.message}`);
      return "Une erreur s'est produit lors de la création de l'utilisateur.";
    }

    console.log("✅  [Event] Successfully created user. ✨");
  } else {
    // If shouldCreateUser is false, update the user
    if (userID) {
      // S'assurer encore une fois que managerId n'est pas null avant de l'utiliser ici. Bien que logiquement, il ne devrait pas être null dans ce bloc.
      const { error: updatedAuthError } = await adminClient.updateUserById(
        userID, // managerId est maintenant garanti d'être une string ici grâce à la condition au-dessus
        {
          email: email,
          password: password,
          user_metadata: {
            name: name,
          },
        }
      );

      if (updatedAuthError) {
        console.error(
          `❌  [Error updating auth user] ${updatedAuthError.message}`
        );
        return "Une erreur s'est produit lors de la mise à jour de l'utilisateur.";
      }

      const { error: updatedUserError } = await supabase
        .from("users")
        .update({
          email: email,
          password: password,
          name: name,
        })
        .eq("id", userID); // managerId est également garanti d'être une string ici

      if (updatedUserError) {
        console.error(
          `❌  [Error updating db user] ${updatedUserError.message}`
        );
        return "Une erreur s'est produit lors de la mise à jour de l'utilisateur.";
      }

      console.log("✅  [Event] Successfully updated user. ✨");
    } else {
      // Cas improbable, mais pour la robustesse, on gère le cas où managerId serait null dans le bloc 'else'
      console.error(
        "❌ Erreur logique : managerId est null dans le bloc de mise à jour."
      );
      return "Erreur interne : ID de manager manquant pour la mise à jour.";
    }
  }
}

export async function updateManager_(
  managerId: string,
  props: { email: string; password: string; name: string },
  center_id: string
) {
  const supabase = createClient();
  let notFound = managerId ? false : true; // Flag to check if the user is not found
  const { email, password, name } = props; // Variables to store the user's email, password, and name

  // Get the user by ID from the adminClient
  const { error } = await adminClient.getUserById(managerId);

  if (error) {
    // Check if the error message is "User not found"
    // If it is, set the notFound flag to true, otherwise log the error message
    if (error.message === "User not found") {
      notFound = true;
    } else {
      console.error("Erreur auth:", error.message);
      return "Erreur serveur"; // Return an error message if the error is not "User not found"
    }
  }

  if (notFound) {
    // If the user is not found, create a new user
    const { data: createdAuthUser, error: createAuthError } =
      await adminClient.createUser({
        email: email,
        password: password,
        user_metadata: {
          name: name,
        },
      });

    if (createAuthError) {
      console.error(
        `❌  [Error verifying user existence] ${createAuthError.message}`
      );
      // Return an error message if there is an error creating the user
      return "Une erreur s'est produit lors de la création de l'utilisateur.";
    }

    // Create a new user in the users table
    // The difference between the createdAuthUser and the createdUser is that
    // the createdAuthUser contains the user's id, while the createdUser does not
    // This is because the createdAuthUser is used to create the user in the Authentisation Users table
    // The createdUser is used to create the user in the public users table
    const { error: createUserError } = await supabase.from("users").insert({
      id: createdAuthUser.user.id,
      email: email,
      password: password,
      role: "manager",
    });

    if (createUserError) {
      console.error(
        `❌  [Error verifying user existence] ${createUserError.message}`
      );
      // Return an error message if there is an error creating the user
      return "Une erreur s'est produit lors de la création de l'utilisateur.";
    }

    console.log("✅  [Event] Successfully created user. ✨");
  } else {
    // If the user is found, update the user
    // Update the user in the Authentisation Users table
    const { error: updatedAuthError } = await adminClient.updateUserById(
      managerId,
      {
        email: email,
        password: password,
        user_metadata: {
          name: name,
        },
      }
    );

    if (updatedAuthError) {
      console.error(`❌  [Error updating user] ${updatedAuthError.message}`);
      // Return an error message if there is an error updating the user
      return "Une erreur s'est produit lors de la mise à jour de l'utilisateur.";
    }

    // Update the user in the public users table
    const { error: updatedUserError } = await supabase
      .from("users")
      .update({
        email: email,
        password: password,
        role: "manager",
        center_id: center_id,
        name: name,
      })
      .eq("id", managerId);

    if (updatedUserError) {
      console.error(`❌  [Error updating user] ${updatedUserError.message}`);
      // Return an error message if there is an error updating the user
      return "Une erreur s'est produit lors de la mise à jour de l'utilisateur.";
    }

    console.log("✅  [Event] Successfully updated user. ✨");
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data: user } = await supabase.auth.signUp(data);

  if (error) {
    console.error(`❌  [SignUp Error] ${error.message}`);
    return;
  }

  // Verify if user already exists in users table
  const { data: existingUser, error: checkUserError } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.user?.email);

  if (checkUserError) {
    console.error(
      `❌  [Error verifying user existence] ${checkUserError.message}`
    );
    return;
  }

  // Store user in table if he doesn't exist
  if (existingUser?.length === 0) {
    const { error: insertUserError } = await supabase.from("users").insert({
      email: user.user?.email,
      password: formData.get("password"),
      role: "manager",
    });

    if (insertUserError) {
      console.error(`❌  [Insertion user error] ${insertUserError.message}`);
      return;
    }

    console.log("✅  [Event] Successfully created user. ✨");
    return;
  }

  console.log("[Event Signup] User already exists!");
}
