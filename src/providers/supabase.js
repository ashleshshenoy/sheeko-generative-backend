// supabase client
const { createClient } = require("@supabase/supabase-js");


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY;

//supabase client 
const supabase = createClient(supabaseUrl, supabaseKey);

// supabase admin client 
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});


module.exports = {
	supabase,
	supabaseAdmin,
};