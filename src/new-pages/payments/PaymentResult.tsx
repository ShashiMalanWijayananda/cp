import "./PaymentResult.css";
import React, {FC} from "react";

const PaymentResult: FC = () => {
    const result = "success";

    const successResult = () => {
        return (
            <div className={"payment-result payment-result-content"}>
                <div><img src={"images/success.svg"}/></div>
                <div className={"payment-result payment-result-header"}>Payment Success!</div>
                <div className={"payment-result payment-result-info"}>Welcome On Board. You Tickets will be visible in
                    “My Tickets” Page
                </div>
                <div>
                    <button>Go to My Tickets</button>
                </div>
            </div>
        )
    }

    const failedResult = () => {
        return (
            <div className={"payment-result payment-result-content"}>
                <div><img src={"images/failed.svg"}/></div>
                <div className={"payment-result payment-result-header"}>Payment Failed!</div>
                <div className={"payment-result payment-result-info"}>We could’t complete your payment. Please try
                    again to secure your boarding pass.
                </div>
                <div>
                    <button>Try again</button>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>

            <div className={`payment-result ${result === "success" ? "success" : "failed"}`}>
                {result === "success" ? successResult() : failedResult()}
            </div>

        </React.Fragment>
    )
}

export default PaymentResult;
