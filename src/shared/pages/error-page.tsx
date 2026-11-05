import {useRouteError, isRouteErrorResponse, Link} from "react-router-dom";
import {ROUTES} from "../../app/router/routes.ts";

function ErrorPage(){
    const error = useRouteError();
    let title = "Đã xảy ra lỗi";
    let message = "Có lỗi không mong muốn xảy ra";
    if (isRouteErrorResponse(error)){
        title = `Lỗi: ${error.status}`;
        message = error.statusText || error.data;
    }else if (error instanceof Error){
        message = error.message;
    }

    return(
      <div style={{textAlign: "center", padding: "50px"}}>
          <h1>{title}</h1>
          <p>{message}</p>
          <Link to={ROUTES.LOGIN}>Quay lại Login</Link>
      </div>
    );
}

export default ErrorPage;