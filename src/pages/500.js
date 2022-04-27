import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Result } from 'antd';
import http500InternalServerErrorLogo from 'assets/images/exceptions/500.png';

const Http500InternalServerError = () => {
  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="card">
          <Helmet title="Server Error" />
          <Result
            title="500"
            subTitle="Ooops, something went wrong on the server"
            extra={<Link to="/" className="btn btn-primary">&larr; Go back to the home page</Link>}
            icon={<div><img src={http500InternalServerErrorLogo} className="img-fluid" alt="server error" /></div>}
          />
        </div>
      </div>
    </div>
  )
}

export default Http500InternalServerError;
