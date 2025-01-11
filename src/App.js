import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Henok Enyew",
    image: "img/henok2.jpg",
    balance: -7,
  },
  {
    id: 499476,
    name: "Ephrem Kitachew",
    image: "img/ephrem.jpg",
    balance: -50,
  },
  {
    id: 933372,
    name: "Sarah Smith",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 864345,
    name: "Ermias Desalegn",
    image: "img/ermias.jpg",
    balance: 50,
  },
];


export default function App() {
  const [ showAddFriend, setShowAddFriend ] = useState(false);
  const [ friends, setFriends ] = useState(initialFriends);
  const [ selectedFriend, setSelectedFriend ] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
    // setShowAddFriend(show=>!show);
  }

  function handleAddFriend(friend) {
    setFriends(friends => [ ...friends, friend ]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend(curSelected =>
      curSelected?.id === friend.id ? null : friend);
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) => friends.map((friend) => friend.id === selectedFriend.id ?
      { ...friend, balance: friend.balance + value } : friend)
    );

    // Hiding the split bill form
    setSelectedFriend(null);
  }


  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={ friends } selectedFriend={ selectedFriend } onSelection={ handleSelection } />
        {
          showAddFriend &&
          <FormAddFriend onAddFriend={ handleAddFriend } />
        }
        <Button onClick={ handleShowAddFriend }>{ showAddFriend ? 'Close' : 'Add friend' }
        </Button>
      </div>
      { selectedFriend &&
        <FormSplitBill selectedFriend={ selectedFriend }
          onSplitBill={ handleSplitBill }
          key={ selectedFriend.id }
        /> }
    </div>
  );
}

function Button({ children, onClick }) {
  return <button className="button" onClick={ onClick }>{ children }</button>;
}

function FriendsList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>
      {
        friends.map(friend =>
          <Friend friend={ friend }
            selectedFriend={ selectedFriend }
            onSelection={ onSelection }
            key={ friend.id }
          />
        )
      }
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelection }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={ isSelected ? 'selected' : '' }>
      <img src={ friend.image }
        alt={ friend.name }
        width={45}
        height={45}
        // style={ { width: '50px', height: '50px' } } 
      />
      <h3 className="name">{ friend.name }</h3>

      { friend.balance < 0 && (
        <p className="red">
          You owe { friend.name } ${ Math.abs(friend.balance) }
        </p>
      ) }

      { friend.balance > 0 && (
        <p className="green">
          { friend.name } owes you ${ friend.balance }
        </p>
      ) }
      { friend.balance === 0 && (
        <p>
          You and { friend.name } are even
        </p>
      ) }
      <Button onClick={ () => onSelection(friend) }>{ isSelected ? 'Close' : 'Select' }</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [ name, setName ] = useState('');
  const [ image, setImage ] = useState('https://i.pravatar.cc/48');

  const id = crypto.randomUUID();

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      id,
      name,
      image: `${ image }?=${ id }`,
      balance: 0,
    };
    onAddFriend(newFriend);

    // Resetting the input fields
    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form className="form-add-friend" onSubmit={ handleSubmit }>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input type="text" value={ name } onChange={ (e) => setName(e.target.value) } />
      <label>🌄Image URL</label>
      <input type="text" value={ image } onChange={ (e) => setImage(e.target.value) } />
      <Button>Add</Button>
    </form>
  );
}


function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [ bill, setBill ] = useState('');
  const [ paidByUser, setPaidByUser ] = useState('');
  const [ whoIsPaying, setWhoIsPaying ] = useState('user');

  const paidByFriend = bill ? bill - paidByUser : '';


  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={ handleSubmit }>
      <h2>Split a bill with { selectedFriend.name }</h2>
      <label>💰Bill value</label>
      <input type="number" value={ bill } onChange={ (e) => setBill(Number(e.target.value)) } />
      <label>🧍‍♂️Your expense</label>
      <input type="number"
        value={ paidByUser }
        onChange={ (e) =>
          setPaidByUser(Number(e.target.value) > bill ?
            paidByFriend : Number(e.target.value))
        }
      />
      <label>🧑‍🤝‍🧑{ `${ selectedFriend.name }'s` } Expense</label>
      <input type="number" disabled value={ paidByFriend } />
      <label>🤑Who is paying the bill?</label>
      <select onChange={ (e) => setWhoIsPaying(e.target.value) }>
        <option value="user">You</option>
        <option value="friend">{ selectedFriend.name }</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

