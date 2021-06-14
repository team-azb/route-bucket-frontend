import { useState, useEffect } from 'react'
import RouteEditor from './RouteEditor'
import { getRoutes } from '../api/routes'
import { Route } from '../types'
import axios from 'axios'

function RouteWorkbanch(){
    const [inputValue, setInputValue] = useState<string>('initialState');
    const [routes, setRoutes] = useState<Route[]>([]);
    const [route, setRoute] = useState<string>('')

    useEffect(() => {
        let unmounted = false;
        (async () => {
            const res =  await getRoutes()
            if(res && !unmounted){
                setRoutes(res.data.routes.map(route => {
                    return {
                        id: route.id,
                        name: route.name,
                    }
                }))
            }
        })()
        return () => {
            unmounted = true
        };
    }, []);

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

    const Routes = () => {
        const RouteList = routes.map((route) => {
            return(
                <li key={route.id}>
                    <a href='./'>{route.name}</a>
                </li>
            )
        })
        return(
            <ul>
                {RouteList}
            </ul>
        )
        
    }

    return(
        <>
        <div>
            <p>ルートの作成</p>
            <input type="text" onChange={event => setInputValue(event.target.value)}/>
            <button onClick={onClickHandler}>create route</button>
            <p>ルートの一覧</p>
            <Routes/>
        </div>
        <hr/>
        {route ? <RouteEditor route={route}/> : null}
        </>
    )
}

export default RouteWorkbanch;