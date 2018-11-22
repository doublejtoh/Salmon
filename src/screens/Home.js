import React from 'react';
import { Button, View, Text } from 'react-native';
import RNPhotosFramework from 'react-native-photos-framework';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        // check if salmon album is created.

        RNPhotosFramework.getAlbumsByTitle('Salmon').then((response) => { if (response.albums.length === 0) {
            RNPhotosFramework.createAlbum('Salmon');
        }});
    
    }
    render() {
        return(
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Button
                    title="Go to SalmonCamera"
                    onPress={() => this.props.navigation.navigate('Camera')}
                />
                <Button
                    title="Go to Salmon Camera Roll"
                    onPress={() => this.props.navigation.navigate('CameraRoll')}
                />
            </View>
        );
    }
}