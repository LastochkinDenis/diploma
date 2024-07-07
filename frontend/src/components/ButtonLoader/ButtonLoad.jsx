import './ButtonLoad.css'

export default function ButtonLoad({buttonText, statusLoad, callback}) {
    return (
        <div className="button-load__wraper">
            {
                statusLoad ? (
                    <div className="button-load button-load-animation">
                        <div className="button-load-animation-item"></div>
                        <div className="button-load-animation-item"></div>
                        <div className="button-load-animation-item"></div>
                        <div className="button-load-animation-item"></div>
                    </div>
                ) : (
                    <button className="button-load" onClick={() => callback()}>
                        {buttonText}
                    </button>
                )
            }
        </div>
    )
}