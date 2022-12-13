class Command {
  constructor(
    public key: string,
    public description: string,
    public action: () => void
  ) {}

  execute() {
    this.action();
  }
}

export default Command;
