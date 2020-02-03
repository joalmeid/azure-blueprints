abstract class AzureResourceBase {
  private _id?: string;
  private _type?: string;
  private _name: string;

  constructor(name: string) { 
    this._name = name;
  }

  get id(): string {
    return this._id;
  }

  get type(): string {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  set name(newName: string) {
      // if (newName && newName.length > fullNameMaxLength) {
      //     throw new Error("fullName has a max length of " + fullNameMaxLength);
      // }
      this._name = newName;
  }
}