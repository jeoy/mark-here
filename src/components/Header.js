import React, { Component } from 'react';
import './header.scss';

export class Header extends Component {
    state = {
        data: this.props.data
    };

    render() {
        const { data } = this.state;
        return (
            <div className="header">
                <p>{data}</p>
                {data}
            </div>
        );
    }
}

export default Header;
