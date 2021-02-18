import React, {useEffect, useState} from 'react';
import DefaultPanel from "./DefaultPanel";
import ErrorDisplay from "./components/ErrorDisplay";
import {detect} from "detect-browser";
import * as tf from "@tensorflow/tfjs";
import {webgl_support} from "./utils";


function App() {

    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        const browser = detect()
        const name = browser?.name;
        const version = browser?.version;
        if (name !== null && version !== null && version !== undefined) {
            const numVersion = parseInt(version.split('.')[0])
            if (name === 'chrome') {
                if (numVersion > 87) {
                    try {
                        const prom = tf.setBackend('webgl');
                        prom.then((success) => {
                            if (success && webgl_support()) {
                                tf.enableProdMode();
                                setIsSupported(true);
                            }
                        })
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }, [setIsSupported])

    if (!isSupported) {
        return (
            <>
                <h1>Sorry.. only newer versions of Chrome are supported.</h1>
                <h2>If you are using Chrome > version 87 please ensure webgl is enabled.</h2>
            </>
        );
    }
    return (
        <ErrorDisplay>
            <DefaultPanel/>
        </ErrorDisplay>
    )
}

export default App;
