import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectCandidate({
  setSelectedCandidate,
  selectedCandidate,
}: {
  setSelectedCandidate: (value: string) => void;
  selectedCandidate: string;
}) {
  return (
    <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a candidate" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="moise">Moise Katumbi</SelectItem>
          <SelectItem value="adolphe">Adolphe Muzito</SelectItem>
          <SelectItem value="martin">Martin Fayulu</SelectItem>
          <SelectItem value="constant">Constant Mutamba</SelectItem>
          <SelectItem value="félix">Félix Antoine Tshisekedi</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
