import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Home from '../src/screens/Home.js';
import CaptureComplete from '../src/screens/CaptureComplete.js';
import SalmonCamera from '../src/components/SalmonCamera.js';
import SalmonCameraRoll from '../src/components/SalmonCameraRoll.js';
import { mapNavigationStateParamsToProps } from '../src/common/Wrapper.js';

export const MainNavigator = createStackNavigator(
    {
        Home: Home,
        Camera: mapNavigationStateParamsToProps(SalmonCamera),
        CameraRoll: SalmonCameraRoll,
        CaptureComplete: mapNavigationStateParamsToProps(CaptureComplete),
    },
    {
        initialRouteName: 'Home',
    }
);
