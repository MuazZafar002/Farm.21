import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import BottomTabs from './BottomTabs'
import MessagingStack from './MessagingStack'
import {KeyUtils} from '../constants/Utils/KeyUtils'


const Tab = createMaterialTopTabNavigator()

export default function HomeTopTab() {
  return (
      <Tab.Navigator
        initialRouteName={KeyUtils.screens.BottomTabs}
        tabBar={() => null}>
        <Tab.Screen
          name={KeyUtils.screens.BottomTabs}
          component={BottomTabs}
          options={({navigation} : {navigation : any}) => {
            const topTabState = navigation.getState()
            const bottomTabState = topTabState?.routes[topTabState?.index]?.state

            return {
              swipeEnabled:
                !bottomTabState ||
                bottomTabState?.routeNames[bottomTabState?.index] === 'Feed'
                  ? true
                  : false,
            }
          }}
        />
        <Tab.Screen
          name={KeyUtils.screens.MessagingStack}
          component={MessagingStack}
        />
      </Tab.Navigator>
  )
}
