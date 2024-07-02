import Svg, {Path, Rect} from 'react-native-svg'
import {useAppSelector} from '../../src/redux/hooks'

export const LeftArrow = ({width, height}: {width?: number; height?: number}) => {
  const theme = useAppSelector(state => state.theme)
  return (
    <Svg
      width={width ? width : 40}
      height={height ? height : 40}
      viewBox="0 0 40 40"
      fill="none">
      <Path
        d="M8.75 18.75H33.75C34.0815 18.75 34.3995 18.8817 34.6339 19.1161C34.8683 19.3505 35 19.6685 35 20C35 20.3315 34.8683 20.6495 34.6339 20.8839C34.3995 21.1183 34.0815 21.25 33.75 21.25H8.75C8.41848 21.25 8.10054 21.1183 7.86612 20.8839C7.6317 20.6495 7.5 20.3315 7.5 20C7.5 19.6685 7.6317 19.3505 7.86612 19.1161C8.10054 18.8817 8.41848 18.75 8.75 18.75Z"
        fill={theme.appearance.primaryTextColor}
      />
      <Path
        d="M9.26754 20.0001L19.635 30.3651C19.8698 30.5998 20.0016 30.9182 20.0016 31.2501C20.0016 31.5821 19.8698 31.9004 19.635 32.1351C19.4003 32.3698 19.082 32.5017 18.75 32.5017C18.4181 32.5017 18.0998 32.3698 17.865 32.1351L6.61504 20.8851C6.49863 20.769 6.40627 20.6311 6.34326 20.4792C6.28024 20.3273 6.2478 20.1645 6.2478 20.0001C6.2478 19.8357 6.28024 19.6729 6.34326 19.521C6.40627 19.3692 6.49863 19.2312 6.61504 19.1151L17.865 7.86511C18.0998 7.6304 18.4181 7.49854 18.75 7.49854C19.082 7.49854 19.4003 7.6304 19.635 7.86511C19.8698 8.09983 20.0016 8.41817 20.0016 8.75011C20.0016 9.08205 19.8698 9.4004 19.635 9.63511L9.26754 20.0001Z"
        fill={theme.appearance.primaryTextColor}
      />
    </Svg>
  )
}
