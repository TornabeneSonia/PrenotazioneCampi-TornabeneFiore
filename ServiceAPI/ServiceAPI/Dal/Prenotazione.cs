using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceAPI.Dal
{

    public class Utente
    {
        public int Id { get; set; }
        public string Surname { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

    }

    public class Prenotazione
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Time { get; set; }
        public string Date { get; set; }
        public string Campo { get; set; }
    }
}
