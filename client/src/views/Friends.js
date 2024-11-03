import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Friends ({token})
{
    const [friendList, setFriendList] = useState(null)
    const [friendPseudo, setFriendPseudo] = useState(null)
    const [added, setAdded] = useState(null)
    const [friendsRequest, setFriendsRequest] = useState(null)

    function addFriend (e)
    {
        e.preventDefault()
        axios.get(`https://api.betaseries.com/members/search?key=ee1167c7b9cb&login=${friendPseudo}`)
        .then((res) => {
            axios.post(`https://api.betaseries.com/friends/friend?key=ee1167c7b9cb&token=${token}&id=${res.data.users[0].id}`)
            .then((res) => {
                setAdded(true)
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function approveFriend (id)
    {
        axios.post(`https://api.betaseries.com/friends/friend?key=ee1167c7b9cb&token=${token}&id=${id}`)
            .then((res) => {
                setAdded(true)
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function deleteFromFriends (e)
    {
        if(e.target.id === "1")
        {
            axios.post(`https://api.betaseries.com/friends/block?key=ee1167c7b9cb&token=${token}&id=${e.target.value}`)
            .then((res) => {
                setAdded('blocked')
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
        }
        else 
        {
            axios.delete(`https://api.betaseries.com/friends/friend?key=ee1167c7b9cb&token=${token}&id=${e.target.value}`)
            .then((res) => {
                setAdded('deleted')
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
        }

    }

    useEffect(() => {
        axios.get(`https://api.betaseries.com/friends/list?key=ee1167c7b9cb&token=${token}`)
        .then((res) => {
            setFriendList(res.data.users)
            console.log(res.data.users);
        })
        .catch((error) => {
            console.log(error);
        })
    },[token, added])

    useEffect(() => {
        axios.get(`https://api.betaseries.com/friends/requests?key=ee1167c7b9cb&token=${token}&received=true`)
        .then((res) => {
            setFriendsRequest(res.data.users)
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        })
    },[token,added])

    return (
        <div className="my-4">
            <p className="bg-stone-800 text-white w-1/2 px-2 mx-auto">Ajouter un ami</p>
            <form onSubmit={addFriend} className="flex flex-col bg-stone-800 w-1/2 mx-auto p-4 gap-2"> 
                <input 
                className="border text-stone-900 w-1/2 mx-auto"
                placeholder="Pseudo de l'utilisateur"
                onChange={(e) => {setFriendPseudo(e.target.value)}}
                />
                <button type="submit" className="bg-white text-stone-800 w-1/4 mx-auto px-2 rounded-xl hover:scale-105">Ajouter</button>
            </form>
            <p className="bg-stone-800 text-white w-1/2 px-2 mt-2 mx-auto">Voici vos amis : </p>
            {
                friendList && friendList.length !== 0 ?
                friendList.map((items, index) => (
                    <div key={index} className="bg-stone-800 w-1/2 mx-auto rounded-xl my-4">
                        <div className="flex justify-center gap-4">
                            <p>{items.login}</p>
                            <button value={items.id} id="1" onClick={deleteFromFriends} className="hover:scale-105">Bloquer</button>
                            <button value={items.id} id="2" onClick={deleteFromFriends} className="hover:scale-105">Supprimer</button>
                        </div>
                    </div>
                )) : <p className="text-stone-800">Coup dur pour Guillaume</p>
            }
            <p className="bg-stone-800 text-white w-1/2 px-2 mt-2 mx-auto">Vos requêtes en attentes : </p>
            {
                friendsRequest && friendsRequest.length !== 0 ?
                friendsRequest.map((items,index) => (
                    <div key={index} className="bg-stone-800 w-1/2 mx-auto rounded-xl my-4">
                        <div className="flex justify-center gap-4">
                            <p>{items.login}</p>
                            <p className="px-2 hover:scale-105 text-white cursor-pointer" onClick={() => {approveFriend(items.id)}}>Approuver</p>
                        </div>
                    </div>
                )) : null
            }
            

        </div>
    )
}