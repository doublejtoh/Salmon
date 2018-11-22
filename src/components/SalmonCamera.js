import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  CameraRoll,
} from 'react-native';

import Camera from 'react-native-camera';
import Slider from 'react-native-slider';
import RNPhotosFramework from 'react-native-photos-framework';
import async from 'async';

const { width, height } = Dimensions.get('window');

export default class SalmonCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundImageUri: props.backgroundImageUri,
      backgroundImageOpacity: 0.5,
    }; // 이것 안해주면 오류난다. (this.state가 null값뜸)
    this.saveToAlbum = this.saveToAlbum.bind(this);
  }

  render() {
    console.log("hey");
    console.log("state: ", this.state);
    return (
      <View style={styles.container}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            playSoundOnCapture={false}
            cropToPreview
            onFocusChanged={this.onCameraFocusChanged.bind(this)}
            aspect={Camera.constants.Aspect.fill}>
            {
              this.state.backgroundImageUri ? 
              <View style={styles.backgroundImage}>
                <Image
                  style={{
                    width: width,
                    height: width,
                    opacity: this.state.backgroundImageOpacity,
                  }}
                  source={{uri: this.state.backgroundImageUri}}
                />
              </View> : null
            }
          </Camera>
        {
          this.state.backgroundImageUri ?
          <View style={styles.capture}>
              <Slider
                style={{ width: 300 }}
                value={this.state.backgroundImageOpacity}
                onValueChange={(value) => this.setState({backgroundImageOpacity: value})}
              />
          </View> : null
        }
        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
      </View>
    );
  }
  takePicture() {
    // this.camera.stopPreview(); setTimeout(() => { this.camera.startPreview(); this.camera.stopPreview();  }, 100); trial for camera blink

    this.camera.capture()
    .then((data) => {
      console.log("data: ", data);
      const backgroundImage = {
        uri: this.state.backgroundImageUri,
      };
      const capturedImage = {
        uri: data.path,
      };

      const tasks = [
        (callback) => this.setImageSize(backgroundImage.uri, backgroundImage, callback),
        (callback) => this.setImageSize(capturedImage.uri, capturedImage, callback),
        (callback) =>   this.saveToAlbum(capturedImage.uri, callback),
      ];
      
      async.parallel(tasks, (err, results) => {
        console.log("err: ", err);
        console.log("results: ", results);
        if (err) {
          console.log("error: ", err);
          return ;
        }
        this.props.navigation.navigate('CaptureComplete', { backgroundImage, capturedImage });
      });
    })
    .catch(err => console.error(err));
  }
  setImageSize(uri, target, callback) {
    if (uri) {
        Image.getSize(uri, (width, height) => {
          target.width = width, target.height = height; 
          if (callback) { callback(null); }
        });
    } else {
      if (callback) { callback('setImageSize error: uri not passed.'); }
    }

  }
  saveToAlbum(uri, callback) {
    RNPhotosFramework.getAlbumsByTitle('Salmon').then((response1) => {
      const {albums} = response1;
      const targetAlbum = albums[0];
      RNPhotosFramework.getAssets({
        startIndex: 0,
        endIndex: 0,
        assetDisplayStartToEnd: false,
      })
      .then((response2) => 
        targetAlbum.addAssets(response2.assets)
          .then((status) => {
            if (callback && status.success) {
              callback(null);
            } else {
              callback('saveToAlbum error');
            }
          }
      ))
    })
  }
  onCameraFocusChanged() {
    console.log("focus changed!!!")
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    // flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: width,
    width: width,
  },
  backgroundImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  slider: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  }
});