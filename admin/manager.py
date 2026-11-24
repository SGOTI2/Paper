from cryptography.fernet import Fernet
import os
import json

print("Please provide the decryption password")
key = input(">")
cipher = Fernet(key)

with open(os.path.join(os.path.dirname(__file__), "credential.enc"), "rb") as f:
  creds_str = cipher.decrypt(f.read()) # Errors if not the right password

creds_json = json.loads(creds_str) # Errors if not the right password

import firebase_admin
creds = firebase_admin.credentials.Certificate(creds_json)
app = firebase_admin.initialize_app(credential=creds)

print("\n\nSuccessfully using AdminSDK; authenticated for", app.project_id, "\nPlease wait while the management console loads\n")

import json
import firebase_admin
from firebase_admin import auth, _user_mgt
from rich.console import Console
from rich.table import Table
import questionary

# ------------------------
# CONFIG
# ------------------------

# Claims every user should have
REQUIRED_CLAIMS = {
  "role": "user"
}

console = Console()


def claims_missing(claims):
  if claims is None:
    claims = {}

  for key, value in REQUIRED_CLAIMS.items():
    if claims.get(key) != value:
      return True
  return False

def yesNo(condition: bool, flip: bool = False):
  return f"[green]{"NO" if flip else "YES"}[/green]" if condition else f"[red]{"YES" if flip else "NO"}[/red]"

def list_users():
  table = Table(title="Users")

  table.add_column("#", style="cyan", width=3)
  table.add_column("UID", style="green")
  table.add_column("Display Name")
  table.add_column("Verified")
  table.add_column("Live Feed")
  table.add_column("Tablet")
  table.add_column("Admin")
  table.add_column("Needs Update")
  table.add_column("Claims JSON")

  users: list[_user_mgt.ExportedUserRecord] = []

  page: _user_mgt.ListUsersPage = auth.list_users()

  index = 1

  while page:
    for user in page.users:
      claims = user.custom_claims or {}
      
      needs = claims_missing(claims)

      table.add_row(
        str(index),
        user.uid,
        user.display_name or "",
        yesNo(claims.get("verified", False)),
        yesNo(claims.get("feedAllow", False)),
        yesNo(claims.get("tabletAllowed", False)),
        yesNo(claims.get("admin", False)),
        yesNo(needs, True),
        str(claims),
      )

      users.append(user)
      index += 1

    page = page.get_next_page()

  console.print(table)

  return users


def edit_user(user: _user_mgt.ExportedUserRecord):
    console.print(f"\nEditing: {user.display_name or user.uid}")

    current = user.custom_claims or {}

    console.print("Current Claims:")
    console.print(json.dumps(current, indent=4))

    mode = questionary.select(
      "Choose action",
      choices=[
        "Replace claims",
        "Set 'verified' claim",
        "Set 'feedAllow' claim",
        "Set 'tabletAllowed' claim",
        "Set 'admin' claim",
        "Clear claims",
        "Cancel"
      ]
    ).ask()

    if mode == "Cancel":
      return

    if mode == "Clear claims":
      auth.set_custom_user_claims(user.uid, None)
      console.print("[green]Claims cleared.[/green]")
      return

    if mode == "Set 'verified' claim":
      boolean = questionary.select(
        "New verified claim",
        choices=[
          "Yes",
          "No"
        ]
      ).ask()
      
      merged = current.copy()
      merged.update({ "verified": boolean == "Yes" })
      new_claims = merged
      auth.set_custom_user_claims(user.uid, new_claims)
      return
    
    if mode == "Set 'feedAllow' claim":
      boolean = questionary.select(
        "New feedAllow claim",
        choices=[
          "Yes",
          "No"
        ]
      ).ask()
      
      merged = current.copy()
      merged.update({ "feedAllow": boolean == "Yes" })
      new_claims = merged
      auth.set_custom_user_claims(user.uid, new_claims)
      return

    if mode == "Set 'tabletAllowed' claim":
          boolean = questionary.select(
            "New tabletAllowed claim",
            choices=[
              "Yes",
              "No"
            ]
          ).ask()
          
          merged = current.copy()
          merged.update({ "tabletAllowed": boolean == "Yes" })
          new_claims = merged
          auth.set_custom_user_claims(user.uid, new_claims)
          return
    
    if mode == "Set 'admin' claim":
      boolean = questionary.select(
        "New admin claim",
        choices=[
          "Yes",
          "No"
        ]
      ).ask()
      
      merged = current.copy()
      merged.update({ "admin": boolean == "Yes" })
      new_claims = merged
      auth.set_custom_user_claims(user.uid, new_claims)
      return
      
    text = questionary.text(
      "Enter JSON claims:"
    ).ask()

    try:
      new_claims = json.loads(text)
    except Exception:
      console.print("[red]Invalid JSON[/red]")
      return


    auth.set_custom_user_claims(user.uid, new_claims)

    console.print("[green]Claims updated.[/green]")


def main():
  users = list_users()
  while True:

    choice = questionary.text(
      "Enter row number to edit (blank to quit) (r to refresh list)"
    ).ask()

    if not choice:
      break
    
    if choice == "r":
      users = list_users()
      continue

    if not choice.isdigit():
      continue

    index = int(choice) - 1

    if index < 0 or index >= len(users):
      continue

    edit_user(users[index])


if __name__ == "__main__":
    main()