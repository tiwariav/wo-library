import Lorem from "../../vendors/Lorem.js";
import { Card } from "../atoms/index.js";

export function LoremCard() {
  return (
    <Card layout="horizontal">
      <Lorem count={1} units="paragraphs" />
    </Card>
  );
}
