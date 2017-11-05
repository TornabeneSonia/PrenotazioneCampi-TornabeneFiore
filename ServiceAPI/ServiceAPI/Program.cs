using Microsoft.AspNetCore.Hosting;
using ServiceAPI.Dal;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace ServiceAPI
{
    class Program
    {
        static void Main(string[] args)
        {

            using (var context = new PrenotazioniDbContext())
            {
               
                // Create database
                context.Database.EnsureCreated();


                //inserisco dei campi manualmente

                Prenotazione s1 = new Prenotazione()
                {
                    Email = "mario.rossi@gmail.com",
                    Time = "20:00",
                    Date = "7/11/2017",
                    Campo = "Calcio"
                   
                };

                Prenotazione s2 = new Prenotazione()
                {
                    Email = "mario.rossi@gmail.com",
                    Time = "20:00",
                    Date = "7/11/2017",
                    Campo = "Tennis"

                };

                context.Prenotazioni.Add(s1);
                context.Prenotazioni.Add(s2);
                context.SaveChanges();

                Utente t1 = new Utente()
                {
                    Surname = "Rossi",
                    Name = "Mario",
                    Email = "mario.rossi@gmail.com",
                    Password = "ciao",
                };

                context.Utenti.Add(t1);

                context.SaveChanges();

                
            
            }

            var host = new WebHostBuilder()
                .UseKestrel()
                .UseStartup<Startup>()
                .Build();

            Task restService = host.RunAsync();
            
            System.Diagnostics.Process.Start("cmd", "/C start http://localhost/netcoreapp2.0/corsoing/");
            restService.Wait();

            
        }

    }
}