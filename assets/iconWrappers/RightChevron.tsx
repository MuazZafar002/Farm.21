import Svg, {Path} from 'react-native-svg'
import {useAppSelector} from '../../src/redux/hooks'

export const RightChevron = () => {
  const theme = useAppSelector(state => state.theme)
  return (
    <Svg width="12" height="20" viewBox="0 0 12 20" fill="none">
      <Path
        d="M11.3999 10L1.3999 20L-9.72748e-05 18.6L8.5999 10L-9.72748e-05 1.4L1.3999 0L11.3999 10Z"
        fill={theme.appearance.primaryTextColor}
      />
    </Svg>
  )
}
