import React from 'react';
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    Icon,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { createTabNavigator } from 'react-navigation';
import { mapNavigationStateParamsToProps } from '../common/Wrapper.js';
import { getImageSizeJson } from '../common/Functions.js';
import async from 'async';

const { width, height } = Dimensions.get('window');

export default class CaptureComplete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        const { backgroundImage, capturedImage } = this.props;
        console.log("constructor", backgroundImage, capturedImage);
        this.TopNavigator = createTabNavigator({
            overlap: mapNavigationStateParamsToProps(CaptureCompleteView, {type: 'overlap', capturedImage, backgroundImage}),
            default: mapNavigationStateParamsToProps(CaptureCompleteView, {type: 'default', capturedImage}),
            separate: mapNavigationStateParamsToProps(CaptureCompleteView, {type: 'separate', capturedImage, backgroundImage}),
        }, {
            tabBarPosition: 'top',
            tabBarOptions: {
                indicatorStyle: {
                    borderBottomWidth: 0,
                }
            }
        });
    }
    render() {
        const TopNavigator = this.TopNavigator;
        return (
            <TopNavigator />
        );
    }
}

class CaptureCompleteView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundImageOpacity: 0,
            capturedImageOpacity: 1,
        };
        this.toggleOpacity = this.toggleOpacity.bind(this);
    }
    renderByType(type) {
        console.log("background: ",this.props.backgroundImage);
        switch(type) {
            case 'overlap':
                return (
                    <View style={viewStyles.ImageContainer}>
                        <Image
                            style={{...getImageSizeJson(this.props.capturedImage.width, this.props.capturedImage.height, width), position: 'absolute', opacity: this.state.capturedImageOpacity}}
                            source={{uri: this.props.capturedImage.uri}}
                        />
                        <Image
                            style={{...getImageSizeJson(this.props.backgroundImage.width, this.props.backgroundImage.height, width), position: 'absolute', opacity: this.state.backgroundImageOpacity}}
                            source={{uri: this.props.backgroundImage.uri}}
                        />
                        <TouchableOpacity
                            style={{
                                borderWidth:1,
                                borderColor:'rgba(0,0,0,0.2)',
                                alignItems:'center',
                                justifyContent:'center',
                                width:50,
                                height:50,
                                backgroundColor:'#fff',
                                borderRadius:100,
                                position: 'absolute',
                                right: 30,
                                bottom: 100,
                            }}
                            onPressIn={() => { this.toggleOpacity("onPressIn")}}
                            onPressOut={() => { this.toggleOpacity("onPressOut")}}
                        >
                        </TouchableOpacity>
                    </View>
                );
            case 'default':
                return (
                    <View style={viewStyles.ImageContainer}>
                        <Image
                            style={getImageSizeJson(this.props.capturedImage.width, this.props.capturedImage.height, width)}
                            source={{uri: this.props.capturedImage.uri}}
                        />
                    </View>
                );
            case 'separate':
                return (
                    <View style={viewStyles.ImageContainer}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Image
                                    style={getImageSizeJson(this.props.backgroundImage.width, this.props.backgroundImage.height, width/2.2)}
                                    source={{uri: this.props.backgroundImage.uri}}
                                />
                                <Text>
                                    Before
                                </Text>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Image
                                    style={{...getImageSizeJson(this.props.capturedImage.width, this.props.capturedImage.height, width/2.2), marginLeft: 5}}
                                    source={{uri: this.props.capturedImage.uri}}
                                />
                                <Text>
                                    After
                                </Text>
                            </View>
                        </View>
                    </View>
                );
        }
    }
    toggleOpacity(type) {
        switch(type) {
            case "onPressIn":
                this.setState(prevState => ({
                    capturedImageOpacity: 0,
                    backgroundImageOpacity: 1,
                }));
                break;
            case "onPressOut":
                this.setState(prevState => ({
                    capturedImageOpacity: 1,
                    backgroundImageOpacity: 0,
                }));
                break;
        }
    }
    render() {
        console.log("type: ",this.props.type);
        console.log("asd: ",this.props.capturedImage, this.props.backgroundImage);
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {
                    this.renderByType(this.props.type)
                }
            </View>
        );
    }
}

const viewStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
    }
});
