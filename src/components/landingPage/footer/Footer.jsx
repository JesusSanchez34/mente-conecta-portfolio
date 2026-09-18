import React from 'react'

export function Footer() {
    return (
        <footer id="footer" className="footer dark-background">
            <div className="container">
                <h3 className="sitename">Mente Conecta</h3>
                <p>Un apoyo para ti.</p>
                <div className="social-links d-flex justify-content-center">
                    <a href=""><i className="bi bi-twitter-x"></i></a>
                    <a href=""><i className="bi bi-facebook"></i></a>
                    <a href=""><i className="bi bi-instagram"></i></a>
                    <a href=""><i className="bi bi-skype"></i></a>
                    <a href=""><i className="bi bi-linkedin"></i></a>
                </div>
                <div className="container">
                    <div className="copyright">
                        <span>Copyright</span> <strong className="px-1 sitename">Mente Conecta</strong> <span>All Rights Reserved</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
