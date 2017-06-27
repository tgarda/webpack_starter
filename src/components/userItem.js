import React from 'react';
import { Link } from 'react-router-dom';

const UserItem = (props) => (
  <Link
    className='box'
    onClick={props.onClick}
    //sample URL for to: /user:orangeleopard (where orangeleopard is the user name)
    //normally we would use an ID after user:..., but this API does not always provide an ID
    to={`/user:${props.user.login.username}`}
  >
    <img src={props.user.picture.thumbnail} />
  <span>{props.user.login.username}</span>
  </Link>
)

UserItem.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default UserItem
