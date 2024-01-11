function ShowBuyers({buyer}) {

    return ( 
        <div>
            <div className="flex flex-row space-x-4">
                <h3>Player:</h3>
                <p>{buyer.player}</p>
            </div>
        </div>
     );
}

export default ShowBuyers;