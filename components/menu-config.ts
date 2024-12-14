export interface MenuItem {
  label: string
  action: () => void
}

export const createMenuItems = ({
  onImportClick,
  onReset,
}: {
  onImportClick: () => void
  onReset: () => void
}) => [
  {
    label: 'Import CSV',
    action: onImportClick,
  },
  {
    label: 'Reset Board',
    action: onReset,
  },
] 