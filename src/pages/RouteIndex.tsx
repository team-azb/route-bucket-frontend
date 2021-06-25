import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRoutes, postRoutes, deleteRoute } from '../api/routes'
import { Route } from '../types'

function RouteIndex(){
    const [inputValue, setInputValue] = useState<string>('');
    const [routes, setRoutes] = useState<Route[]>([]);

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

    async function onClickPost(){
        try {
            postRoutes(inputValue)
            const getRes =  await getRoutes()
            if(getRes){
                setRoutes(getRes.data.routes.map(route => {
                    return {
                        id: route.id,
                        name: route.name,
                    }
                }))
            }
        } catch (error) {
            console.error(error);   
        }
    }

    async function onClickDelete(id: string){
        try {
            deleteRoute(id)
            const getRes =  await getRoutes()
            if(getRes){
                setRoutes(getRes.data.routes.map(route => {
                    return {
                        id: route.id,
                        name: route.name,
                    }
                }))
            }
        } catch (error) {
            console.error(error);   
        }
    }

    const Routes = () => {
        const RouteList = routes.map((route) => {
            return(
                <li key={route.id}>
                    <h3>{route.name}</h3>
                    <Link to={`/${route.id}`}>
                        <button>ルートを編集</button>
                    </Link>
                    <button onClick={()=>{onClickDelete(route.id)}}>ルートを削除</button>
                    <hr/>
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
        <div>
            <h2>ルートの作成</h2>
            <input type="text" onChange={event => setInputValue(event.target.value)}/>
            <button onClick={onClickPost}>create route</button>
            <h2>ルートの一覧</h2>
            <Routes/>
        </div>
    )
}

export default RouteIndex;