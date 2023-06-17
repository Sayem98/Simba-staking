import React from 'react'
import { Link } from 'react-router-dom'
import Connect from './hooks/Connect'

export default function Header() {
    return (

        <nav id="PPNavbar" className="navbar navbar-expand-md navbar-dark">
            <div className="container-fluid">
        
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/images/logo.png" width="70" height="70" alt="Binance Smart Node" className="me-2" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                        <Connect />
                    </ul>
                </div>
            </div>
        </nav>
    )
}
