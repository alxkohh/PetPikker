<script>
  import ChangePasswordForm from "../Components/ChangePasswordForm.svelte";
  import EditCreditCard from "../Components/EditCreditCard.svelte";
  import UpdateAddress from "../Components/UpdateAddress.svelte";
  import AddNewAdminForm from "../Components/AddNewAdminForm.svelte";
  import { account, pw, acctype } from "../user.js";
  import { onMount } from "svelte";

  let username;
  let pass;
  let usertype;
  let addressobject;
  let currentcreditcard;

  const unsubscribe = account.subscribe((value) => {
    username = value;
  });
  const unsubscribe2 = pw.subscribe((value) => {
    pass = value;
  });
  const unsubscribe3 = acctype.subscribe((value) => {
    usertype = value;
  });

  onMount(async () => {
    await fetch(`http://18.139.110.246:3000/users/getaddress/${username}`, {
      method: "GET",
    }).then((resp) =>
      resp.json().then((data) => (addressobject = data.address))
    );

    await fetch(`http://18.139.110.246:3000/users/getcreditcard/${username}`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => (currentcreditcard = data.cardnum));
  });

  function reload() {
    fetch(`http://18.139.110.246:3000/users/getaddress/${username}`, {
      method: "GET",
    }).then((resp) =>
      resp.json().then((data) => (addressobject = data.address))
    );

    fetch(`http://18.139.110.246:3000/users/getcreditcard/${username}`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => (currentcreditcard = data.cardnum));
  }

  const handleChangePassword = (e) => {
    const received = e.detail;
    const newpw = received.new;
    const current = received.current;
    if (pass != current) {
      alert("Current password Incorrect!");
    } else {
      fetch(
        `http://18.139.110.246:3000/users/changepassword/${username}/${current}/${newpw}`,
        {
          method: "PATCH",
        }
      )
        .then((resp) => resp.json())
        .then((data) => {});
      alert("Password Changed!");
    }
  };

  const handleChangePasswordAdmin = (e) => {
    const received = e.detail;
    const newpw = received.new;
    const current = received.current;
    if (pass != current) {
      alert("Current password Incorrect!");
    } else {
      fetch(
        `http://18.139.110.246:3000/admins/changepassword/${username}/${current}/${newpw}`,
        {
          method: "PATCH",
        }
      )
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        });
      alert("Password Changed!");
    }
  };

  const handleEditCreditCard = (e) => {
    const newCreditCard = e.detail;
    const cardnum = newCreditCard.num;
    const expiry =
      newCreditCard.expirymonth.toString() +
      newCreditCard.expiryyear.toString();

    fetch(
      `http://18.139.110.246:3000/users/updatecreditcard/${username}/${cardnum}`,
      {
        method: "PATCH",
      }
    )
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .then(() => reload());

    alert("Credit Card Saved!");
  };

  const handleAddAdmin = (e) => {
    const newAdmin = e.detail;
    //console.log(newAdmin);
    const user = newAdmin.username;
    const pw = newAdmin.password;

    fetch(`http://18.139.110.246:3000/admins/register/${user}/${pw}`, {
      method: "POST",
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .catch((e) => {
        alert("Error: Admin Username used!");
      })
      .then(onfulfilled, alert("Admin account created!"));
  };

  const handleUpdateAddress = (e) => {
    const newAddress = e.detail;
    const address = newAddress.address;
    const postal = newAddress.postal;
    console.log(newAddress);

    fetch(
      `http://18.139.110.246:3000/users/updateaddress/${username}/${address}`,
      {
        method: "PATCH",
      }
    )
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .then(() => reload());

    alert("Address Updated!");
  };
</script>

<style>
  h1 {
    text-align: center;
  }
</style>

<h1>Settings</h1>
{#if usertype === 'Admin'}
  <h3>Password</h3>
  <h4>Update Password</h4>
  <ChangePasswordForm on:changePassword={handleChangePasswordAdmin} />
  <h3>Admin Management</h3>
  <h4>Add new Admin</h4>
  <AddNewAdminForm on:addAdmin={handleAddAdmin} />
{:else}
  <h3>Password</h3>
  <h4>Update Password</h4>
  <ChangePasswordForm on:changePassword={handleChangePassword} />
  <h3>Credit Card</h3>
  {#if currentcreditcard === null}
    <p>You have no saved credit card</p><br />
  {:else}
    <p>Current credit card number: {currentcreditcard}</p><br />
  {/if}
  <h4>Update Credit Card</h4>
  <EditCreditCard on:editCreditCard={handleEditCreditCard} />
  <h3>Address</h3>
  {#if addressobject === null}
    <p>You have no saved Address</p><br />
  {:else}
    <p>Current saved address: {addressobject}</p><br />
  {/if}
  <h4>Update Address</h4>
  <UpdateAddress on:updateAddress={handleUpdateAddress} />
{/if}
