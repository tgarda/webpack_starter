import React from 'react';
import Button from './button';
import UserItem from './userItem';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    this.props.fetchUsers();
  }

  render() {
    const { data, fetchUsers, setUser } = this.props;

    console.log('in user component, data:', data);

    return (
      <div className='container'>
        <Button
          onClick={fetchUsers}
          text={'Fetch Users'}
          className={'btn btn-blue'}
        />

        <div id={'users'}>
          {data.users.map((user, i) => {
            return <UserItem
              key={i}
              user={user}
              onClick={() => setUser(user)}
            />
          })}
        </div>
      </div>
    )
  }
}

export default Users;
