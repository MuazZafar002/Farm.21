import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Image, FlatList, Alert } from 'react-native';
import tw from 'twrnc';
import * as imagepicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppSelector } from '../../redux/hooks';
import { KeyUtils } from '../../constants/Utils/KeyUtils';
import { getProducts,deleteProduct,createProduct } from '../../core/productBackend';
import { IProduct } from '../../interfaces/product';
import Popup from '../../Component/common/Popup';
import Loader from '../../Component/common/Loading'
import { UiUtils } from '../../constants/Utils/UiUtils';

const Marketplace = ({navigation} : any) => {
  const theme = useAppSelector((state) => state.theme);
  const [activeTab, setActiveTab] = useState<'buyers' | 'sellers'>('buyers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [showChoices, setshowChoices] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeletePopupVisible, setDeletePopupVisible] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(''); 
  const [loading,setLoading] = useState(false);
  const [load,setLoad]=useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    contact:'',
    images: [] as string[],
  });
  const user1 = useAppSelector(state => state.user)
 const user_email=user1.user.email
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(); // Fetch products using the API function
      setProducts(response);
      setFilteredProducts(response); // Initially set filtered products to all products
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle error fetching products (e.g., show error message)
    }
    finally{
      setLoading(false);
    }
  };
   const handleSearch = () => {
    const filtered = searchQuery
      ? products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;

    setFilteredProducts(filtered);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const handleConfirmSeller = async () => {

    const { title, description, price,contact } = newProduct;

    // Update newProduct with selected images
    const updatedProduct = {
      title,
      description,
      price,
      contact,
      images: imageUris, // Set images to all selected image URIs
    };
    try{
         setLoad(true);
      await createProduct(updatedProduct.title,updatedProduct.description,updatedProduct.price,updatedProduct.contact,updatedProduct.images);
        setLoad(false);
        UiUtils.showToast('Product Created Successfully');
      setImageUris([]);
      setNewProduct({
       title:(''),
       description:(''),
       price:(''),
       contact:(''),
       images:([])})
      }catch(error){
        setLoad(false)
        console.error('error creating product');
        UiUtils.showToast('Error in creating product. Kindly try again later')
      }finally{
      fetchProducts();
      }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImageUris = [...imageUris];
    newImageUris.splice(index, 1);
    setImageUris(newImageUris);
  };

  const handleCameraInput = async () => {
    const checkPermission = await imagepicker.getCameraPermissionsAsync();
    if (checkPermission.granted) {
      const image: imagepicker.ImagePickerResult | undefined = await imagepicker.launchCameraAsync({
        mediaTypes: imagepicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (image?.assets?.length && !image.canceled) {
        const uri = (image.assets as imagepicker.ImagePickerAsset[])[0]?.uri;
        if (uri) {
          setImageUris((prevUris) => [...prevUris, uri]);
        }
      }
    } else {
      const permissionResponse = await imagepicker.requestCameraPermissionsAsync();
      if (permissionResponse.granted) {
        const image = await imagepicker.launchCameraAsync({
          mediaTypes: imagepicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (image?.assets?.length && !image.canceled) {
          const uri = (image.assets as imagepicker.ImagePickerAsset[])[0]?.uri;
          if (uri) {
            setImageUris((prevUris) => [...prevUris, uri]);
          }
        }
       else {
          Alert.alert('Cancelled', 'You cancelled the process');
        }
      } else {
        Alert.alert('Permission', 'Permission not granted. Cannot proceed further');
      }
    }
  };

  const handleGalleryInput = async () => {
    const checkPermission = await imagepicker.getMediaLibraryPermissionsAsync();
    if (checkPermission.granted) {
      const image = await imagepicker.launchImageLibraryAsync({
        mediaTypes: imagepicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (image?.assets?.length && !image.canceled) {
        const uri = (image.assets as imagepicker.ImagePickerAsset[])[0]?.uri;
        if (uri) {
          setImageUris((prevUris) => [...prevUris, uri]);
        }
      }
     else {
        Alert.alert('Cancelled', 'You cancelled the process');
      }
    } else {
      const getPermission = await imagepicker.requestMediaLibraryPermissionsAsync();
      if (getPermission.granted) {
        const image = await imagepicker.launchImageLibraryAsync({
          mediaTypes: imagepicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (image?.assets?.length && !image.canceled) {
          const uri = (image.assets as imagepicker.ImagePickerAsset[])[0]?.uri;
          if (uri) {
            setImageUris((prevUris) => [...prevUris, uri]);
          }
        }
       else {
          Alert.alert('Permission not granted', 'Cannot proceed further');
        }
      }
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(selectedProductId);
      setDeletePopupVisible(false);
      fetchProducts(); // Refresh products after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle delete error
    }
  };

  const handleCancel = () => {
    setSelectedProductId('');
    setDeletePopupVisible(false);
  };
  const renderCard = ({ item }: { item: IProduct }) => {
    const productImage = item.product_attachments.length > 0 ? item.product_attachments[0] : null;

    const handleDelete = (productId: string) => {
      setSelectedProductId(productId);
      setDeletePopupVisible(true);
    };

    return (
      <TouchableOpacity
        style={[
          tw.style('mb-4 p-2 mr-2 rounded overflow-hidden flex-0.5'),
          { backgroundColor: theme.appearance.marketplaceCard },
        ]}
        onPress={() => {
          navigation.navigate(KeyUtils.screens.ProductDetails,{productId:item.id});
        }}
      >
        {productImage && (
          <Image source={{ uri: productImage }} style={tw.style('w-full h-40 mb-2 mt-5 mr-5')} />
        )}
        <Text style={[tw.style('font-bold text-lg mb-1'), { color: theme.appearance.primaryTextColor }]}>
          {item.name}
        </Text>
        {user_email === item.user_products.email && (
          <TouchableOpacity
            style={{ position: 'absolute', top: 1, right: 1, padding: 4,marginBottom:10 }}
            onPress={() => handleDelete(item.id)}
          >
            <Feather name="trash-2" size={20} color="black" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[tw`flex-1 pt-4` , {
      backgroundColor : theme.appearance.background
    }]}>
      <View style={tw.style('flex-row justify-between mb-4')}>
        <TouchableOpacity
          style={[
            tw`flex-1 p-2`,
            {
              backgroundColor: activeTab === 'buyers' ? theme.appearance.marketplaceActiveTab : theme.appearance.marketplaceInActiveTab,
            },
          ]}
          onPress={() => setActiveTab('buyers')}
        >
         <Text
          style={[
            tw`text-lg font-bold text-center`,
            {
              color: activeTab === 'buyers' ? theme.appearance.activeTabText : theme.appearance.inActiveTabText,
            },
          ]}>
            Buyers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
           style={[
            tw`flex-1 p-2`,
            {
              backgroundColor: activeTab === 'sellers' ? theme.appearance.marketplaceActiveTab : theme.appearance.marketplaceInActiveTab,
            },
          ]}
          onPress={() => setActiveTab('sellers')}
        >
          <Text
          style={[
            tw`text-lg font-bold text-center`,
            {
              color: activeTab === 'sellers' ? theme.appearance.activeTabText : theme.appearance.inActiveTabText,
            },
          ]}>
            Sellers
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'buyers' && (
        <View style={tw.style('flex-1')}>
          <TextInput
           style={[tw`p-2 mb-4 border-[${theme.appearance.primaryTextColor}] border-2`,{color:theme.appearance.primaryTextColor }]}
            placeholder="Search by product title"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.appearance.primaryTextColor}
          />
          {loading? (
            <Loader message='Fetching Products' />
          ):(
          <FlatList
            data={filteredProducts}
            renderItem={renderCard}
            numColumns={2}
          />
          )}
          {selectedProductId && (
        <Popup
          visible={isDeletePopupVisible}
          onClose={() => setSelectedProductId('')}
          header="Confirm Delete"
          paragraph="Are you sure you want to delete this product?"
          button1Text="Delete"
          button1OnPress={handleDeleteProduct}
          button2Text="Cancel"
          button2OnPress={handleCancel}
        />
      )}
        </View>
      )}

      {activeTab === 'sellers' && (
        <ScrollView style={tw.style('flex-1')}>
          <Text style={[tw`font-bold text-lg mb-4`,{color:theme.appearance.primaryTextColor}]}>Add New Product</Text>
          <TextInput
            style={[tw`p-2 mb-4 border-2`,{borderColor:theme.appearance.primaryTextColor, color:theme.appearance.primaryTextColor }]}
            placeholder="Product Title"
            value={newProduct.title}
            onChangeText={(text) => setNewProduct({ ...newProduct, title: text })}
            placeholderTextColor={theme.appearance.primaryTextColor}
          />

          <TextInput
            style={[tw`p-2 mb-4 border-2`,{borderColor:theme.appearance.primaryTextColor, color:theme.appearance.primaryTextColor }]}
            placeholder="Product Description"
            value={newProduct.description}
            onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
            placeholderTextColor={theme.appearance.primaryTextColor}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={[tw`p-2 mb-4 border-2`,{borderColor:theme.appearance.primaryTextColor, color:theme.appearance.primaryTextColor }]}
            placeholder="Product Price"
            value={newProduct.price}
            onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
            placeholderTextColor={theme.appearance.primaryTextColor}
          />
          <TextInput
            style={[tw`p-2 mb-4 border-2`,{borderColor:theme.appearance.primaryTextColor, color:theme.appearance.primaryTextColor }]}
            placeholder="Contact Number"
            value={newProduct.contact}
            maxLength={11}
            onChangeText={(text) => setNewProduct({ ...newProduct, contact: text })}
            placeholderTextColor={theme.appearance.primaryTextColor}
            keyboardType="number-pad"
          />
           <View style={tw.style('flex-1')}>
            {imageUris.map((uri, index) => (
              <View key={index} style={tw.style('mb-5')}>
                <Pressable onPress={() => handleRemoveImage(index)} style={tw.style('absolute top-0 right-0 p-2')}>
                  <Feather name="x-circle" size={24} color="red" />
                </Pressable>
                <Image source={{ uri }} style={tw.style('w-70 h-20')} />
              </View>
            ))}
            <View style={tw.style('flex flex-col items-center')}>
              {showChoices && (
                <View style={tw.style('flex flex-row gap-2')}>
                  <Pressable
                    style={[tw`rounded-full w-10 justify-center mb-2 p-2 h-12`,{backgroundColor:theme.appearance.iconBackground}]}
                    onPress={async () => await handleCameraInput()}
                  >
                    <Entypo name="camera" size={22} color="black" />
                  </Pressable>
                  <Pressable
                    style={[tw`rounded-full w-10 justify-center mb-2 p-2 h-12`,{backgroundColor:theme.appearance.iconBackground}]}
                    onPress={async () => await handleGalleryInput()}
                  >
                    <Feather name="paperclip" size={22} color="black" />
                  </Pressable>
                </View>
              )}
              <Pressable
                style={[tw`w-50 h-8 mb-10 rounded-3xl justify-center`,{backgroundColor:theme.appearance.buttonBackground}]}
                onPress={() => setshowChoices(!showChoices)}
              >
                <Text style={[tw`text-center`,{color:theme.appearance.buttonText}]}>Upload Images</Text>
              </Pressable>
            </View>
          </View>
          {load?(
            <View style={[tw`absolute inset-0 bg-opacity-70 bg-black flex justify-center items-center`]}>
              <Loader message='Creating Product' />
            </View>
          ):(
           <View style={tw.style('items-center')}>
          <TouchableOpacity style={[tw`p-2 rounded w-50`,{backgroundColor:theme.appearance.buttonBackground}]} onPress={handleConfirmSeller}>
            <Text style={[tw`text-center`,{color: theme.appearance.buttonText}]}>Confirm</Text>
          </TouchableOpacity>
          </View>)}
        </ScrollView>
            
      )}
    </View>
  );
};

export default Marketplace;
