export default function Loader({show}: {show: boolean}) {
    console.log("show")
    console.log(show)
    return show ? (<div className="loader"/>) : null
}
