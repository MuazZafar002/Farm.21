import tw from 'twrnc'
import React, {useState, useContext, useEffect} from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import {Rating} from 'react-native-ratings'
import Swiper from 'react-native-swiper'
import {useAppSelector} from '../../redux/hooks'
import Icon from 'react-native-vector-icons/FontAwesome'
import {IProduct} from '../../interfaces/product'
import {getProducts} from '../../core/productBackend'
import {useRoute} from '@react-navigation/native'
import {RouteProp} from '@react-navigation/native'
import Loading from '../../Component/common/Loading'
import {Button} from '../../Component/common/Button'
import {SafeAreaView} from 'react-native-safe-area-context'
import PaymentModal from '../../Component/PaymentGateway/PaymentModal'
type RootStackParamList = {
  ProductDetail: {productId: string} // Define the expected params with productId
}

// Use RouteProp to specify the expected route and params type
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>

const ProductDetail = ({
  navigation,
  route,
}: {
  navigation: any
  route: ProductDetailRouteProp
}) => {
  // Access productId from route.params
  const productId = route.params.productId

  const theme = useAppSelector(state => state.theme)
  const [products, setProducts] = useState<IProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([])
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  //const route=useRoute()
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const fetchedProducts = await getProducts() // Fetch all products using the API function
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchAllProducts()
  }, [])

  useEffect(() => {
    // Check if navigation params contain productId
    // const productId = route.params?.productId;

    if (productId && products.length > 0) {
      // Find the product with matching ID
      const product = products.find(item => item.id === productId)

      setSelectedProduct(product || null) // Set selected product or null if not found
      setImagesLoaded(
        new Array(product?.product_attachments.length || 0).fill(false)
      )
    }
  }, [productId, products])

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setModalVisible(true)
  }
  const handlePayment = () => {
    console.log('inside handle payment')
    setPaymentModalVisible(true)
  }
  if (!selectedProduct) {
    return <Loading />
  }

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.appearance.background,
        }}
        contentContainerStyle={{
          // flex: 1,
          width: '100%',
        }}>
        <View style={tw`p-4`}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mb-4`}>
            <Icon
              name="arrow-left"
              size={24}
              color={theme.appearance.primaryTextColor}
            />
          </TouchableOpacity>

          {/* Product Images */}
          <TouchableOpacity onPress={() => openImageModal(0)}>
            <Image
              source={{uri: selectedProduct.product_attachments[0]}} // Assuming images are stored as URIs
              style={{
                width: '95%',
                height: 330,
                borderWidth: 2,
                borderRadius: 10,
                marginBottom: 10,
                marginLeft: 10,
                marginTop: 10,
              }}
            />
          </TouchableOpacity>

          {/* Title */}
          <Text
            style={[
              tw`text-2xl font-bold my-2`,
              {color: theme.appearance.primaryTextColor},
            ]}>
            {selectedProduct.name}
          </Text>

          {/* Description */}
          <Text
            style={[
              tw`text-base my-2`,
              {color: theme.appearance.primaryTextColor},
            ]}>
            {selectedProduct.desc}
          </Text>

          {/* Price */}
          <Text
            style={[
              tw`text-lg font-bold my-2`,
              {color: theme.appearance.primaryTextColor},
            ]}>
            {`Price: ${selectedProduct.price}`}
          </Text>

          <View style={[tw`flex-row items-center my-2`]}>
            <Text
              style={[
                tw`text-base mr-2`,
                {color: theme.appearance.primaryTextColor},
              ]}>
               {`Phone: ${selectedProduct.phone}`}
            </Text>
          </View>
        </View>

        {/* Image Modal */}
        <Modal visible={modalVisible}>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.appearance.modalBackground,
            }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  paddingTop : 55,
                  paddingRight : 20
                }}
              >
                <Pressable onPress={() => setModalVisible(false)}>
                  <Text
                    style={{
                      color : '#FFFFFF',
                      textAlign : 'right'
                    }}
                  >Close</Text>
                </Pressable>
              </View>
            {/* Use Swiper for the modal image slideshow */}
            <Swiper
              loop={false}
              showsPagination={false}
              index={selectedImageIndex}
              onIndexChanged={index => setSelectedImageIndex(index)}>
              {selectedProduct.product_attachments.map((image, index) => (
                <View key={index} style={{flex: 1 , justifyContent : 'center'}}>
                  {!imagesLoaded[index]}
                  <Image
                    source={{uri: image}} // Assuming images are stored as URIs
                    style={{
                      width: '100%',
                      height: '80%',
                      resizeMode: 'contain',
                    }}
                    onLoad={() => {
                      const updatedImagesLoaded = [...imagesLoaded]
                      updatedImagesLoaded[index] = true
                      setImagesLoaded(updatedImagesLoaded)
                    }}
                  />
                </View>
              ))}
            </Swiper>

            <Text
              style={{
                color: theme.appearance.primaryTextColor,
                fontSize: 16,
                textAlign: 'center',
                bottom: 20,
              }}>
              {`${selectedImageIndex + 1}/${selectedProduct.product_attachments.length}`}
            </Text>
          </View>
        </Modal>
        <Button
          text="Buy Now"
          buttonStyle={{marginBottom: 30}}
          onClick={handlePayment}
        />
      </ScrollView>
      {/* Image Modal */}
      <Modal visible={modalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.appearance.modalBackground,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingTop: 55,
              paddingRight: 20,
            }}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'right',
                }}>
                Close
              </Text>
            </Pressable>
          </View>
          {/* Use Swiper for the modal image slideshow */}
          <Swiper
            loop={false}
            showsPagination={false}
            index={selectedImageIndex}
            onIndexChanged={index => setSelectedImageIndex(index)}>
            {selectedProduct.product_attachments.map((image, index) => (
              <View key={index} style={{flex: 1, justifyContent: 'center'}}>
                {!imagesLoaded[index]}
                <Image
                  source={{uri: image}} // Assuming images are stored as URIs
                  style={{
                    width: '100%',
                    height: '80%',
                    resizeMode: 'contain',
                  }}
                  onLoad={() => {
                    const updatedImagesLoaded = [...imagesLoaded]
                    updatedImagesLoaded[index] = true
                    setImagesLoaded(updatedImagesLoaded)
                  }}
                />
              </View>
            ))}
          </Swiper>

          <Text
            style={{
              color: theme.appearance.primaryTextColor,
              fontSize: 16,
              textAlign: 'center',
              bottom: 20,
            }}>
            {`${selectedImageIndex + 1}/${selectedProduct.product_attachments.length}`}
          </Text>
        </View>
      </Modal>
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        price={selectedProduct.price}
        productName={selectedProduct.name}
      />
    </>
  )
}

export default ProductDetail
