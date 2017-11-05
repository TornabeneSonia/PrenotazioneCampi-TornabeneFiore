using Microsoft.AspNetCore.Mvc;
using ServiceAPI.Dal;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace ServiceAPI
{
    [Route("api")]
    public class ServiceApiController : Controller
    {
        static readonly object setupLock = new object();
        static readonly SemaphoreSlim parallelism = new SemaphoreSlim(2);

        [HttpGet("setup")]
        public IActionResult SetupDatabase()
        {
            lock (setupLock)
            {
                using (var context = new PrenotazioniDbContext())
                {
                    // Create database
                    context.Database.EnsureCreated();
                }
                return Ok("Database creato");
            }
        }

        
        [HttpGet("prenotazioni")]
        public async Task<IActionResult> GetPrenotazioni()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new PrenotazioniDbContext())
                {
                    return Ok(context.Prenotazioni.ToList());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }
        
        [HttpGet("prenotazione")]
        public async Task<IActionResult> GetPrenotazione([FromQuery]string campo)
        {
            using (var context = new PrenotazioniDbContext())
            {
                return Ok(await context.Prenotazioni.FirstOrDefaultAsync(x => x.Campo == campo));
            }
        }

        [HttpGet("prenotazione")]
        public async Task<IActionResult> GetPrenotazione([FromQuery]int id)
        {
            using (var context = new PrenotazioniDbContext())
            {
                return Ok(await context.Prenotazioni.FirstOrDefaultAsync(x => x.Id == id));
            }
        }


        [HttpPut("prenotazioni")]
        public async Task<IActionResult> CreatePrenotazione([FromBody]Prenotazione prenotazione)
        {
            using (var context = new PrenotazioniDbContext())
            {
                context.Prenotazioni.Add(prenotazione);

                await context.SaveChangesAsync();

                return Ok();
            }
        }


        [HttpPost("prenotazioni")]
        public async Task<IActionResult> UpdatePrenotazione([FromBody]Prenotazione prenotazione)
        {
            using (var context = new PrenotazioniDbContext())
            {
                context.Prenotazioni.Update(prenotazione);
                await context.SaveChangesAsync();
                return Ok();
            }
        }



        [HttpDelete("prenotazioni")]
        public async Task<IActionResult> DeletePrenotazione([FromQuery]int id)
        {
            using (var context = new PrenotazioniDbContext())
            {
                var prenotazione = await context.Prenotazioni.FirstOrDefaultAsync(x => x.Id == id);
                context.Prenotazioni.Remove(prenotazione);
                await context.SaveChangesAsync();
                return Ok();
            }
        }


        [HttpGet("utenti")]
        public async Task<IActionResult> GetUtenti()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new PrenotazioniDbContext())
                {
                    return Ok(context.Utenti.ToList());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        [HttpGet("utente")]
        public async Task<IActionResult> GetUtente([FromQuery]int id)
        {
            using (var context = new PrenotazioniDbContext())
            {
                return Ok(await context.Utenti.FirstOrDefaultAsync(x => x.Id == id));
            }
        }

        [HttpPut("utenti")]
        public async Task<IActionResult> CreateUtente([FromBody]Utente utente)
        {
            using (var context = new PrenotazioniDbContext())
            {
                context.Utenti.Add(utente);

                await context.SaveChangesAsync();

                return Ok();
            }
        }
        
        [HttpPost("utenti")]
        public async Task<IActionResult> UpdateUtente([FromBody]Utente utente)
        {
            using (var context = new PrenotazioniDbContext())
            {
                context.Utenti.Update(utente);
                await context.SaveChangesAsync();
                return Ok();
            }
        }


        [HttpDelete("utenti")]
        public async Task<IActionResult> DeleteUtente([FromQuery]int id)
        {
            using (var context = new PrenotazioniDbContext())
            {
                var utente = await context.Utenti.FirstOrDefaultAsync(x => x.Id == id);
                context.Utenti.Remove(utente);
                await context.SaveChangesAsync();
                return Ok();
            }
        }
    }
        
}