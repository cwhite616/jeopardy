export interface MenuItem {
  label: string
  action: () => void
}

export const createMenuItems = ({
  onImportClick,
  onReset,
  onShowFinalJeopardy,
}: {
  onImportClick: () => void
  onReset: () => void
  onShowBoard: () => void
  onShowFinalJeopardy: (difficulty: string) => void
}) => [
  {
    label: 'Final: Middle School',
    action: () => onShowFinalJeopardy('middle'),
  },
  {
    label: 'Final: High School',
    action: () => onShowFinalJeopardy('high'),
  },
  {
    label: 'Final: College',
    action: () => onShowFinalJeopardy('college'),
  },
  {
    label: 'Final: Postgrad',
    action: () => onShowFinalJeopardy('postgrad'),
  },
  {
    label: 'Import CSV',
    action: onImportClick,
  },
  {
    label: 'Reset Board',
    action: onReset,
  },
] 