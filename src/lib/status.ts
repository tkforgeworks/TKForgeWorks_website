export function statusClasses(status: string): string {
  switch (status) {
    case "Active":
      return "bg-success-light text-success-text";
    case "Completed":
      return "bg-success-light text-success-text";
    case "Paused":
      return "bg-warning-light text-warning-text";
    case "Planning":
      return "bg-info-light text-info-text";
    default:
      return "bg-purple-tint text-purple-dark";
  }
}
