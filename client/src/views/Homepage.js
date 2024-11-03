import React, { useEffect, useState } from "react"
import axios from "axios";
import Friends from "./Friends";

export default function Homepage ()
{

    const [login, setLogin] = useState(null)
    const [password, setPassword] = useState(null)
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [series, setSeries] = useState(null)
    const [detailledSerie, setDetailledSerie] = useState(null)
    const [episodes, setEpisodes] = useState(null)
    const [detailledEpisodes, setDetailledEpisode] = useState(null)
    const [isCommenting, setIsCommenting] = useState(null)
    const [comment, setComment] = useState(null)
    const [isWatchingFriends, setIsWatchingFriends] = useState(null)
    const [isWatchingIsOwnShows, setIsWatchingIsOwnShows] = useState(null)
    const [offset, setOffset] = useState(0);
    const [seen, setSeen] = useState(null)
 
    function loginUser (e)
    {
        e.preventDefault();
        axios.post(`http://localhost:8000/readUser`, {password : password})
        .then((res) => {
            axios.post(`https://api.betaseries.com/members/auth?key=ee1167c7b9cb&login=${login}&password=${res.data}`)
            .then((res) => {
                setUser(res.data.user)
                setToken(res.data.token)
            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function changeDate(date) 
    {
       const newDate = new Date(date).toLocaleString('fr-FR', {
          year : "numeric",
          month : "long",
          day : "numeric",
          hour : "2-digit",
          minute : "2-digit"
       })  
       return newDate; 
    }

    function archive()
    {
        axios.post(`https://api.betaseries.com/shows/archive?key=ee1167c7b9cb&thetvdb_id=${detailledSerie.thetvdb_id}&token=${token}`)
        .then((res) => {
            setDetailledSerie(null)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function add ()
    {
        axios.post(`https://api.betaseries.com/shows/show?key=ee1167c7b9cb&thetvdb_id=${detailledSerie.thetvdb_id}&token=${token}`)
        .then((res) => {
            setDetailledSerie(null)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function watched (e)
    {
        let bull = true
        if(e.target.id === "1")
        {
            bull = false
        }
        else 
        {
            bull = true
        }
        axios.post(`https://api.betaseries.com/episodes/watched?key=ee1167c7b9cb&thetvdb_id=${detailledEpisodes.thetvdb_id}&token=${token}&bull=${bull}`)
        .then((res) => {
            setDetailledEpisode(null)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function postComment (e)
    {
        e.preventDefault()
        axios.post(`https://api.betaseries.com/comments/comment?key=ee1167c7b9cb&type=episode&id=${detailledEpisodes.id}&text=${comment}&token=${token}`)
        .then((res) => {
            setIsCommenting(null)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function handleClick ()
    {
        setIsWatchingIsOwnShows(true)
        setOffset(0)
    }

    function removeFromWatched ()
    {
        axios.delete(`https://api.betaseries.com/episodes/watched?key=ee1167c7b9cb&token=${token}&id=${detailledEpisodes.id}`)
        .then((res) => {
            setDetailledEpisode(null)
        })
        .catch((error) => {
            console.log(error);
        })
    }


    useEffect(() => {
        let query = ""
        if(isWatchingIsOwnShows)
        {
            query = `https://api.betaseries.com/shows/member?key=ee1167c7b9cb&token=${token}&limit=4&offset=${offset}`
        }
        else {
            query = `https://api.betaseries.com/shows/discover?key=ee1167c7b9cb&limit=4&offset=${offset}`
        }
        axios.get(query)
        .then((res) => {
            setSeries(res.data.shows)
        })
        .catch((error) => {
            console.log(error);
        })
    },[token, isWatchingIsOwnShows, offset])

    useEffect(() => {
        if(detailledSerie)
        {
            axios.get(`https://api.betaseries.com/shows/episodes?key=ee1167c7b9cb&thetvdb_id=${detailledSerie.thetvdb_id}`)
            .then((res) => {
                setEpisodes(res.data.episodes)
            })
            .catch((error) => {
                console.log(error);
            })
        }
    },[detailledSerie, isWatchingIsOwnShows])

    useEffect(() => {
        if(detailledEpisodes)
        {
            console.log(detailledEpisodes.id);
            console.log(token);
            axios.get(`https://api.betaseries.com/episodes/display?key=ee1167c7b9cb&id=${detailledEpisodes.id}&token=${token}`)
            .then((res) => {
                setSeen(res.data.episode.user.seen)
            })
            .catch((error) => {
                console.log(error);
            })
        }
    },[detailledEpisodes, token])

    return (
        <div>

            {/* Début header */}

            {
                !user ?
                    <div className="bg-[#1C1C1C] p-2">
                        <form onSubmit={loginUser} className="flex flex-col lg:flex-row gap-4 justify-center">
                            <input
                            type="text"
                            placeholder="Login BetaSeries"
                            onChange={(e) => {setLogin(e.target.value)}}
                            />
                            <input 
                            type="password"
                            placeholder="Mot de passe BetaSeries"
                            onChange={(e) => {setPassword(e.target.value)}}
                            />
                            <button type="submit" className="bg-stone-200 px-2">Se connecter</button>
                        </form>
                    </div>
                : null
            }
            {
                user ?
                <div className="bg-bg-[#1C1C1C] text-white lg:text-xl p-2">
                    <p >{user.login}</p>
                    {
                        !isWatchingFriends ?
                        <div className="flex flex-col lg:flex-row justify-center lg:gap-8">
                            <p className="cursor-pointer hover:scale-105" onClick={() => {setIsWatchingFriends(true)}}>Voir ses amis</p>
                            <p className="cursor-pointer hover:scale-105" onClick={() => {setIsWatchingIsOwnShows(null)}}>Revoir toutes les séries</p>
                            <p className="cursor-pointer hover:scale-105" onClick={handleClick}>Voir ses séries</p> 
                        </div>
                        : null
                    }
                    
                </div> : null
            }

            {/* Fin header */}

            {/* Début mainBody */}

            {
                !isWatchingFriends ?
                <div className="flex flex-wrap w-3/4 mx-auto mt-8 h-screen">

                {/* liste des séries */}

                {
                    series && !detailledSerie ?
                    series.map((items,index) => (
                        <div key={index} className="flex flex-col w-full md:flex-row md:w-1/4 px-1 mb-4 cursor-pointer hover:scale-105" onClick={() => {setDetailledSerie(items)}}>
                            <img src={items.images.poster} alt="poster serie" className="text-white object-cover"></img>
                        </div>
                    )) : null
                }

                {
                    !detailledEpisodes && !detailledSerie
                    ?
                    <div className="flex justify-center w-full gap-8">
                        {offset > 0 ? <p onClick={() => {setOffset(offset - 4)}} className="cursor-pointer bg-[#1C1C1C] text-white p-2 rounded-xl h-fit hover:scale-105">Précedent</p> : null}
                        <p onClick={() => {setOffset(offset + 4)}} className="cursor-pointer bg-[#1C1C1C] text-white p-2 rounded-xl h-fit hover:scale-105">Suivant</p>
                    </div>
                    : null
                }

                

                {/* Fin liste des séries */}
                {/* Détails d'une série */}

                {
                    detailledSerie && !detailledEpisodes ? 
                    <div>
                        <p onClick={() => {setDetailledSerie(null)}} className="cursor-pointer text-xl font-bold bg-[#1C1C1C] text-white rounded-xl hover:scale-105">Revoir toutes les séries</p>
                        <div className="flex justify-center gap-4 flex-col">
                            <p className="text-lg font-bold">{detailledSerie.original_title}</p>
                            {
                                user ?
                                <div className="w-1/6 mx-auto">
                                    <p className="bg-[#1C1C1C] px-2 text-white cursor-pointer rounded-full mb-4 hover:scale-105" onClick={add}>+</p>
                                    <p onClick={archive} className="bg-[#1C1C1C] text-white rounded-xl px-2 cursor-pointer hover:scale-105">Archiver la série</p>
                                </div>
                                : null
                            }
                        </div>       
                        <p>Note de la série : {detailledSerie.notes.mean.toFixed(2)} pour : {detailledSerie.notes.total} votes</p>
                        <img src={detailledSerie.images.show} alt="affiche de la série" className="w-1/2 mx-auto my-2"></img>
                        <p className="border p-2 bg-[#1C1C1C] text-white my-4 rounded-xl">{detailledSerie.description}</p>
                        <div className="bg-[#1C1C1C] text-white mb-2 rounded-xl flex justify-between p-2">
                            <p>Nombre de saison(s) : {detailledSerie.seasons}</p>
                            <p>Nombre d'épisodes : {detailledSerie.episodes}</p>
                            <p>Durée moyenne des épisodes : {detailledSerie.length}</p>
                        </div>
                        <div className="bg-[#1C1C1C] text-white mb-2 rounded-xl flex justify-around">
                            {
                                Object.keys(detailledSerie.genres).map((items,index) => (
                                    <div key={index}>
                                        <p>{items}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex justify-around gap-8 flex-wrap">
                        {
                            episodes && !detailledEpisodes ?
                            episodes.map((items,index) => (
                                <div key={index} className="flex flex-col cursor-pointer hover:scale-105" onClick={() => {setDetailledEpisode(items)}}>
                                    <img src={detailledSerie.images.poster} alt="miniature épisode" className="w-[150px] h-[150px]"></img>
                                    <p>{items.code}</p>
                                </div>
                            )) : null
                        }
                        </div>
                    </div>
                        
                        // Fin détails de la série
                        // Début détails épisodes

                        : 
                        <div className="w-3/4 mx-auto">
                        {
                            detailledEpisodes ?
                            <div className="w-3/4 mx-auto">
                                {console.log(detailledEpisodes)}
                                <p onClick={() => {setDetailledEpisode(null)}} className="cursor-pointer text-xl font-bold bg-[#1C1C1C] text-white rounded-xl hover:scale-105">Revoir les épisodes</p>
                                <p className="text-lg font-bold">{detailledEpisodes.title}</p>
                                <p>Diffusé le : {changeDate(detailledEpisodes.date)}</p>
                                <p>Note de la série : {detailledEpisodes.note.mean.toFixed(2)} pour : {detailledEpisodes.note.total} votes</p>
                                <img src={detailledSerie.images.poster} alt="miniature épisode" className="w-[250px] h-[250px] mx-auto"></img>
                                <p className="bg-[#1C1C1C] text-white p-2 mt-4 rounded-xl">{detailledEpisodes.description}</p>
                                {
                                    user && !seen ?
                                    <div className="flex flex-col md:flex-row w-full justify-center gap-8 mt-4">
                                        <p onClick={watched} className="bg-[#1C1C1C] text-white rounded-xl cursor-pointer p-1 hover:scale-105" id="1">Marquer comme vu</p>
                                        <p onClick={watched} className="bg-[#1C1C1C] text-white rounded-xl cursor-pointer p-1 hover:scale-105" id="2">Marquer les épisodes précédents comme vus</p>
                                    </div>
                                    : 
                                    user && seen ?
                                    <p onClick={removeFromWatched} className="bg-[#1C1C1C] text-white rounded-xl cursor-pointer mt-4 hover:scale-105"> Enlever de la liste des vus</p> : null
                                
                                }
                                {
                                    user && !isCommenting ?
                                    <p onClick={() => {setIsCommenting(true)}} className="cursor-pointer my-4 p-1 text-white bg-[#1C1C1C] rounded-xl hover:scale-105">Ecrire un commentaire</p>
                                    : null
                                }
                                {
                                    isCommenting ?
                                        <form onSubmit={postComment} className="flex flex-col gap-2 p-2">
                                            <input 
                                                onChange={(e) => {setComment(e.target.value)}}
                                                className="border w-full"
                                            />
                                            <button type="submit" className="border text-white bg-[#1C1C1C] rounded-xl hover:scale-105">Valider</button>
                                        </form>
                                    : null
                                }
                        </div> : null
                        }
                    </div>
                    
                    // Fin détails épisodes
                    
                }
                </div>
                : 

                // Début liste amis
                
                <div className="p-2 text-white">
                    <p onClick={() => {setIsWatchingFriends(null)}} className="cursor-pointer text-xl font-bold bg-[#1C1C1C] text-white rounded-xl hover:scale-105 w-1/2 mx-auto">Voir les séries</p>
                    <Friends id={user.id} token={token} />
                </div>
            }

            {/* Fin liste amis */}
            {/* Fin mainBody */}

        </div>
    )   
}