import {Svg, Path} from 'react-native-svg'
import {useAppSelector} from '../../src/redux/hooks'

export const SearchIcon = () => {
  const theme = useAppSelector(state => state.theme)
  return (
    <Svg width="29" height="25" viewBox="0 0 29 25" fill="none">
      <Path
        d="M10.7857 17.2143C15.9141 17.2143 20.0714 13.6965 20.0714 9.35714C20.0714 5.01776 15.9141 1.5 10.7857 1.5C5.65736 1.5 1.5 5.01776 1.5 9.35714C1.5 13.6965 5.65736 17.2143 10.7857 17.2143Z"
        stroke={theme.appearance.primaryTextColor}
        strokeWidth="1.90476"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M27.6319 23.5003L17.2858 14.8574"
        stroke={theme.appearance.primaryTextColor}
        strokeWidth="1.90476"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
