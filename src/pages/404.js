import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, withRouter } from 'react-router-dom';
import { Result } from 'antd';
import { getLayout } from 'utils/ui';
import http404NotFoundLogo from 'assets/images/exceptions/404.png';

const Http404NotFound = (props) => {
  return (
    <div className="d-flex justify-content-center">
      <div className={getLayout(props.location.pathname) === 'login' ? 'col-sm-5 mx-2' : 'col'}>
        <div className="card">
          <Helmet title="Not Found" />
          <Result
            title="404"
            subTitle="The page is deprecated, deleted, or does not exist at all"
            extra={<Link to="/" className="btn btn-primary">&larr; Go back to the home page</Link>}
            icon={<div><img src={http404NotFoundLogo} className="img-fluid" alt="not found" /></div>}
          />
        </div>
      </div>
    </div>
  )
}

export default withRouter(Http404NotFound);
