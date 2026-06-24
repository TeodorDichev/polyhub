export function formatEnumLabel(value?: string | null): string {
  if (!value) return '—';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace(/_/g, ' ');
}

export function getElectionStatusLabel(status?: string | null): string {
  switch (status) {
    case 'UPCOMING': return 'Upcoming';
    case 'RUNNING': return 'Running';
    case 'FINISHED': return 'Finished';
    default: return status ?? '—';
  }
}

export function getElectionTypeLabel(type?: string | null): string {
  if (!type) return '—';
  return formatEnumLabel(type);
}

export function getPoliticalPositionLabel(position?: string | null): string {
  if (!position) return '—';
  return formatEnumLabel(position);
}
