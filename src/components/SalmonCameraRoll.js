import React from 'react'

import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
  Button,
  CameraRoll,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native'

import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';

let styles
const { width, height } = Dimensions.get('window')
const fetchAmount = 50;


class SalmonCameraRoll extends React.Component {
  static navigationOptions = {
    title: 'Salmon Camera Roll',
  }

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      // index: null,
      lastCursor: null,
      noMorePhotos: false,
      loadingMore: false,
      refreshing: false,
    };
    this.tryGetPhotos = this.tryGetPhotos.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
    this.appendPhotos = this.appendPhotos.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.getPhotosOnFirst = this.getPhotosOnFirst.bind(this);
    // this.getPhotosOnFirst({first: fetchAmount, assetType: 'Photos'});
    this.getPhotos({first: fetchAmount, assetType: 'Photos'});
  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this.getPhotos({first: fetchAmount, assetType: 'Photos'});
      }),
      // this.props.navigation.addListener('willBlur', () => {
      //   this.setState({ isPageFocused: false });
      // })
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  // setIndex = (index) => {
  //   if (index === this.state.index) {
  //     index = null
  //   }
  //   this.setState({ index })
  // }

  getPhotosOnFirst = (fetchParams) => {
    CameraRoll.getPhotos(fetchParams).then(
      r => {
        const photos = r.edges;
        const nextState = {
          loadingMore: false,
        };

        if (!r.page_info.has_next_page) {
          nextState.noMorePhotos = true;
        }

        if (photos.length > 0) {
          nextState.lastCursor = data.page_info.end_cursor;
          nextState.photos = this.state.photos.concat(photos);
          this.state = nextState;
        }
      }
    )
  }

  tryGetPhotos = (fetchParams) => {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => { this.getPhotos(fetchParams)})
    }
  }

  getPhotos = (fetchParams) => {
    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams).then(
      r => this.appendPhotos(r)
    )
  }

  appendPhotos = (data) => {
    const photos = data.edges;
    const nextState = {
      loadingMore: false,
    };

    if (!data.page_info.has_next_page) {
      nextState.noMorePhotos = true;
    }

    if (photos.length > 0) {
      nextState.lastCursor = data.page_info.end_cursor;
      nextState.photos = this.state.photos.concat(photos);
      this.setState(nextState);
    }
  }

  navigate = () => {
    const { navigate } = this.props.navigation;
    navigate('ImageBrowser')
  }

  // share = () => {
  //   const image = this.state.photos[this.state.index].node.image.uri
  //   RNFetchBlob.fs.readFile(image, 'base64')
  //   .then((data) => {
  //     let shareOptions = {
  //       title: "React Native Share Example",
  //       message: "Check out this photo!",
  //       url: `data:image/jpg;base64,${data}`,
  //       subject: "Check out this photo!"
  //     };

  //     Share.open(shareOptions)
  //       .then((res) => console.log('res:', res))
  //       .catch(err => console.log('err', err))
  //   })
  // }

  renderImage = (photo, index) => {
    return (
      <TouchableHighlight
        // style={{opacity: index === this.state.index ? 0.5 : 1}}
        style={{borderTopWidth: 1, borderRightWidth: 1, borderColor: 'white'}}
        key={index}
        underlayColor='transparent'
        onPress={() => {
            this.props.navigation.navigate('Camera', { backgroundImageUri: photo.node.image.uri })
          }
        } 
      >
        <Image
          style={{
            width: width/3,
            height: width/3
          }}
          representation={'thumbnail'}
          source={{uri: photo.node.image.uri}}
        />
      </TouchableHighlight>
    )
  }

  onEndReached = () => {
    if (!this.state.noMorePhotos) {
      this.tryGetPhotos({first: fetchAmount, assetType: 'Photos'});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.modalContainer}>
            {/* {
              this.state.photos.map((p, i) => 
                this.renderImage(p, i);
              ))
            } */}
            <FlatList
              numColumns={3}
              data={this.state.photos}
              initialNumToRender={fetchAmount}
              onEndReachedThreshold={500}
              onEndReached={this.onEndReached}
              refreshing={this.state.refreshing}
              onRefresh={() => this.tryGetPhotos({first: fetchAmount, assetType: 'Photos'})}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                this.renderImage(item, index)
              )}
            />
          {/* {
            this.state.index !== null  && (
              <View style={styles.shareButton}>
                <Button
                    title='Share'
                    onPress={this.share}
                  />
              </View>
            )
          } */}
        </View>
      </View>
    )
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    // paddingTop: 20,
    flex: 1,
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  shareButton: {
    position: 'absolute',
    width,
    padding: 10,
    bottom: 0,
    left: 0
  }
})

export default SalmonCameraRoll