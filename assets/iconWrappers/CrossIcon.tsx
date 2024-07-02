import Svg, {Path} from 'react-native-svg'
import {useAppSelector} from '../../src/redux/hooks'

export const CrossIcon = () => {
  const theme = useAppSelector(state => state.theme)
  return (
    <Svg width="18" height="14" viewBox="0 0 28 26" fill="none">
      <Path
        d="M26.5 2L2 24.5M2 2L26.5 24.5"
        stroke={theme.appearance.primaryTextColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
