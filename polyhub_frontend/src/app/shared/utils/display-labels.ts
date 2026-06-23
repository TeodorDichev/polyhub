export function formatEnumLabel(value?: string | null): string {
  if (!value) {
    return 'Unknown';
  }

  return value
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getElectionStatusLabel(status?: string | null): string {
  switch (status) {
    case 'FINISHED':
      return 'Finished';
    case 'RUNNING':
      return 'Running';
    case 'UPCOMING':
      return 'Upcoming';
    default:
      return formatEnumLabel(status);
  }
}

export function getElectionTypeLabel(type?: string | null): string {
  return formatEnumLabel(type);
}

export function getPoliticalPositionLabel(position?: string | null): string {
  if (!position) {
    return 'Not classified';
  }

  return formatEnumLabel(position);
}
