import { createStackNavigator } from "@react-navigation/stack";
import Marketplace from "./Marketplace";

import PaymentScreen from "../../Component/PaymentGateway/PaymentScreen"
import { KeyUtils } from "../../constants/Utils/KeyUtils";
import PaymentModal from "../../Component/PaymentGateway/PaymentModal";
import ProductDetail from "./Productdetails";

const Stack = createStackNavigator();
export const MarketplaceNavigator = ()=>{
    return(
       <Stack.Navigator 
       initialRouteName={KeyUtils.screens.Marketplace}
       screenOptions={{
        headerShown : false
       }}
       >
            <Stack.Screen name={KeyUtils.screens.Marketplace} component={Marketplace}/>
            <Stack.Screen name={KeyUtils.screens.PaymentModal} component={PaymentModal} />
            <Stack.Screen name={KeyUtils.screens.ProductDetails} component={ProductDetail as any} />
            <Stack.Screen name={KeyUtils.screens.PaymentScreen} component={PaymentScreen}/>
       </Stack.Navigator>
    )
}