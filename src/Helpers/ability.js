import { AbilityBuilder, Ability } from "@casl/ability";
import localForage from 'localforage';

const { can, rules } =  new AbilityBuilder(Ability);
const cache = await localForage.getItem('vuex');

var permissions = [];
try {
    var loggedIn = cache.permissions;
} catch (error) {
    permissions = []; 
}
var check = typeof loggedIn == "string"

if( check ){
    permissions = JSON.parse(loggedIn);
}

can(permissions, 'all');
let ability = new Ability(rules);
export {ability};
