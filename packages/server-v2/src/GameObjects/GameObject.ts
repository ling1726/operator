import { generateId } from "../utils";

export default class GameObject {
  public id: number;
  public displayName: string;

  constructor(displayName: string) {
    this.displayName = displayName;
    this.id = generateId();
  }
}
