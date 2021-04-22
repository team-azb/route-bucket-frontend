import { useState } from 'react'
import Map from './Map'
import axios from 'axios'

function RouteEditor(){
    const [inputValue, setInputValue] = useState<string>('initialState');
    const [route, setRoute] = useState<string>('')

    async function onClickHandler(){
        try {
            const res = await axios.post('/routes/', {
                'name': inputValue
            })
            setRoute(res.data.id);
        } catch (error) {
            console.error(error);   
        }
    }

    return(
        <>
        <div>
            <p>ルートの作成</p>
            <input type="text" onChange={event => setInputValue(event.target.value)}/>
            <button onClick={onClickHandler}>create route</button>
        </div>

        <hr/>
        {route ? <Map route={route}/> : null}
        </>
    )
}

export default RouteEditor;