const { createClient } = require('@supabase/supabase-js')
const { GenerateWallet } = require("./blockchain")
const axios = require("axios")
const supabaseUrl = 'https://dxxhlgvftegkivncnblj.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eGhsZ3ZmdGVna2l2bmNuYmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4Nzk1MjIwNiwiZXhwIjoyMDAzNTI4MjA2fQ.odHwIH0u5WV_sLTV_0DRkK8eKLvt7LftT8R-_LeDxck"


async function authUser(userId) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    let { data: botUsers, error } = await supabase
        .from('botUsers')
        .select("*").eq('userID', userId)
    if (botUsers.length < 1) {
        const pK1 = GenerateWallet()
        const pK2 = GenerateWallet()
        const pK3 = GenerateWallet()
        console.log(pK1)

        const response = await axios.post(
            'https://dxxhlgvftegkivncnblj.supabase.co/rest/v1/botUsers',
            // '{ "some_column": "someValue", "other_column": "otherValue" }',
            {
                pK1, pK2, pK3, "userID": userId
            },
            {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': 'Bearer ' + supabaseKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                }
            }
        );
        // console.log({ data, error })
    } else {
        let { data: botUsers, error } = await supabase
            .from('botUsers')
            .select("*").eq('userID', userId)
        return botUsers[0]
    }
    //fecth for user if exist 
    // generate new wallet
}

module.exports = {
    authUser
}