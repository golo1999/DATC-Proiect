const CustomInput=(props)=>{
    return <div>
        <input id={props.id} type={props.type}/>
        {props.type==="checkbox"&&<label htmlFor="check">Remember me</label>}
    </div>
};
 export default CustomInput;