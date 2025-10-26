import { useState, useEffect } from "react"; 

function Practice(){
    const [count, setCount ] = useState(0);
    
    const increment = () => {
        setCount(count + 1);
    };
    const decrement = () => {
        setCount(count - 1);
    };

    useEffect(() =>{
        document.title = count;
    },[count]);
    
    return (

        <div className="mainBody">
            <button onClick={increment}>Increment</button>
            {count}
            <button onClick={decrement}>Decrement</button>
        </div>
    );
}

export default Practice; 