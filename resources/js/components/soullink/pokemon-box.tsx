import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Plus} from 'lucide-react';
import { useState } from "react";
import { Form } from '@inertiajs/react';
import Select from 'react-select'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError  from '@/components/input-error';
import { store } from '@/actions/App/Http/Controllers/PairController';
import PokemonPair from '@/components/soullink/pokemon-pair';




interface PokemonBoxProps {
  boxPokemon?: any[]; // kept for backward compatibility
  livingBox?: any[];
  deathBox?: any[];
  setLoadedPair?: (pair: any) => void;
  pokemonNames?: string[];
  viewDeathBox: boolean;
  save: {
    id: number;
    name: string;
    player_one_name: string | null;
    player_two_name: string | null;
  };
}

export default function PokemonBox({boxPokemon, pokemonNames, save, setLoadedPair, viewDeathBox, livingBox = [], deathBox = [] }: PokemonBoxProps) {
  const [open, setOpen] = useState(false);
  return (
    <section style={{ backgroundImage: !viewDeathBox ? 'url(/storage/livingbox.png)' : 'url(/storage/deathbox.png)' }} className="w-sm lg:w-2xl grow bg-center bg-no-repeat bg-cover overflow-y-auto">
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 justify-center lg:p-4 p-2"> 
        {/* Render both sets but visually hide the inactive set so images remain mounted */}
        { livingBox.map((pair: any) => (
          <div key={pair.id} className={viewDeathBox ? 'hidden' : ''}>
            <PokemonPair pair={pair} setLoadedPair={setLoadedPair} />
          </div>
        ))}
        { deathBox.map((pair: any) => (
          <div key={pair.id} className={viewDeathBox ? '' : 'hidden'}>
            <PokemonPair pair={pair} setLoadedPair={setLoadedPair} />
          </div>
        ))}
        <Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger style={{ display: viewDeathBox ? 'none' : 'inline-block' }} className="bg-white/85 p-2 lg:p-4 cursor-[url('/storage/PCHand.png'),_pointer] rounded-full justify-self-start self-center shadow-md"><Plus /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-center">Add New Soullink Pair</DialogTitle>
            </DialogHeader>
            <Form onSuccess={() => setOpen(false)} action={store(save.id)} className="flex flex-col justify-around">
              {({ errors }) => (
                <>
                  <div className="flex flex-row">
                    <div className="p-4 mr-4 flex flex-col gap-3">
                      <h3 className="text-[#CC0000]">{save.player_one_name ? save.player_one_name : 'Player One'}</h3>
                      <Select tabIndex={1} required id="playerOnePokemon" name="playerOnePokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerOnePokemon} className="mt-2" />
                      <Input tabIndex={2} placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
                      <InputError message={errors.playerOneNickname} className="mt-2" />
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <h3 className="text-[#3B4CCA]">{save.player_two_name ? save.player_two_name : 'Player Two'}</h3>
                      {/* TODO: select statement first character doesnt register */}
                      <Select tabIndex={3} required id="playerTwoPokemon" name="playerTwoPokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerTwoPokemon} className="mt-2" />
                      <Input tabIndex={4} placeholder="Nickname" id="playerTwoNickname" type="text" name="playerTwoNickname"></Input>
                      <InputError message={errors.playerTwoNickname} className="mt-2" />
                    </div>
                  </div>
                  <InputError message={errors.samePrimaryType} className="mb-2 text-center" />
                  <Button tabIndex={5} type="submit" className="self-center">Add Pair</Button>
                </>
              )}
            </Form>
        </DialogContent>
        </Dialog>
      </div>
      {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, assumenda. Omnis alias nam accusantium rerum molestiae doloribus incidunt cum inventore minus unde, illo excepturi, mollitia at eligendi corporis! Quis delectus debitis asperiores esse beatae tempore aperiam voluptas eligendi dignissimos consequuntur, ratione magni pariatur placeat ex accusantium laborum sunt dolorem quasi! Vel nemo modi, ut maxime autem eius itaque iure corporis, necessitatibus iste mollitia facilis cupiditate veritatis, nihil similique beatae sit minus. Amet, totam reprehenderit! Omnis, inventore eaque, alias velit libero minima error deserunt vitae tenetur ab fuga quam repellat ullam nobis repudiandae voluptas et sapiente, est reiciendis quasi eius cumque? Vero nihil eius culpa aliquid, id reprehenderit quia? Temporibus numquam quis aliquid neque. Iure, veniam illum accusantium dolores corporis perferendis esse est incidunt enim repudiandae facilis nulla aperiam ab eveniet adipisci? Pariatur voluptatum facilis corrupti, tempora modi natus quibusdam dolore nisi cumque dicta rerum quidem distinctio, illum quia! Incidunt doloribus debitis odio architecto, voluptas ea quam mollitia maiores recusandae consectetur, accusamus doloremque molestiae libero illum omnis atque et, aliquam reiciendis quibusdam at iure necessitatibus. Porro rem assumenda delectus nemo maxime eos mollitia praesentium architecto, beatae sequi illum fugit veritatis velit necessitatibus? Debitis, repellendus iusto. Non quo nam soluta esse eaque et nisi consectetur dolorem minus maxime optio a accusamus voluptatibus, quae voluptate. Quaerat harum ratione quod, optio maiores quia corporis, iure, provident officia ipsam facere. Illo quam earum consequuntur fugit placeat quisquam sunt assumenda voluptas, hic doloremque architecto excepturi fuga impedit pariatur quas facilis repellat amet laborum sequi temporibus cumque quasi dolor! Facere amet ipsam debitis maxime natus illum voluptas expedita dolorem, labore officiis placeat beatae? Voluptas quibusdam aperiam quod velit alias sunt, nostrum distinctio labore dolores. Consequuntur repellendus eum magni voluptate vel impedit. Natus modi veniam tempore nulla? Quos adipisci ipsa quia deserunt natus officiis harum blanditiis amet quod illum dolore reiciendis quaerat repellendus, atque ratione! Minus perferendis nulla fuga, consequuntur itaque porro quidem atque voluptatibus! Fugit optio magni qui officia ad deserunt odio tempore omnis voluptatem aliquam assumenda autem quam, architecto ipsum. Mollitia aut commodi culpa temporibus nesciunt doloremque, voluptate modi earum vitae nostrum quis sit facilis error sed aliquam praesentium? Voluptates dolorem obcaecati consequuntur eius voluptate assumenda, consectetur tenetur praesentium, totam, reprehenderit nostrum! Soluta minima reprehenderit obcaecati molestias. Eos, ipsa! Vel, natus neque itaque, optio atque expedita, numquam tempora ut nam laboriosam incidunt. Ipsum quasi iusto, delectus quae commodi, unde fuga accusantium maxime quis voluptatem ducimus id ullam illum non aliquid. Repudiandae pariatur sunt tempora vel modi nesciunt, eaque, atque illo voluptatum distinctio, doloremque exercitationem rem! Doloremque laborum blanditiis praesentium temporibus maiores debitis, voluptas nihil. Vero eligendi laboriosam magni atque maiores? Quibusdam architecto sunt libero harum, nemo sapiente accusantium in magni dolorem aut? Error dolore placeat eius atque animi esse laborum ab corrupti cumque ratione, magnam consequatur minus aut officia quod distinctio provident ipsum quos voluptatum, nulla ullam. Numquam, ea. Quo culpa magnam aperiam ipsum facilis voluptates sint! Accusamus dolore ea distinctio illum. Unde harum, nemo voluptate perspiciatis eaque corporis qui quibusdam ex hic nulla recusandae molestias asperiores molestiae distinctio, vero mollitia inventore quis dolorem non nobis eligendi incidunt. Quibusdam aperiam nihil eos, ex ratione officiis similique eaque eveniet quae culpa laborum odit in fugit est laudantium esse inventore facere nam, recusandae eligendi velit iste sed. Autem, hic unde quod molestiae, sequi eveniet magni repellat praesentium a quo consequuntur iure quisquam? Dicta eius blanditiis ab est, obcaecati ut itaque enim a, quae repudiandae laudantium ea. Dolorum corporis optio ullam, necessitatibus minima ipsam modi quidem fuga. Sapiente itaque at nulla nesciunt sint odio libero maxime ex earum non, illum ad quos voluptates dolor molestias cumque sit distinctio numquam animi qui minus eveniet reiciendis expedita. Beatae, doloremque! Ab ipsum officiis ad obcaecati corrupti. Ullam ducimus error illo quibusdam quos corrupti illum dolorum voluptatem eos cupiditate! Repellat obcaecati minima corporis deserunt corrupti excepturi aut sint placeat, inventore maiores voluptatem ab eaque sed aperiam iusto tenetur incidunt asperiores nemo enim laboriosam delectus totam cum! Recusandae culpa dolorum nostrum consectetur impedit excepturi ducimus in repellat. Id vitae asperiores eum eos, necessitatibus iste numquam repudiandae natus enim nesciunt nostrum amet, qui illum impedit aliquid molestiae nihil. Cupiditate asperiores consequuntur earum excepturi autem consequatur aut saepe omnis, pariatur minus. Iusto asperiores, eos nisi reiciendis quam illo soluta quasi repellat possimus nam voluptatibus ut! Eligendi natus quidem incidunt perferendis, in optio quas omnis nesciunt facilis sed ex dolores vero id dolore totam quo rem aliquam amet impedit? A velit sapiente autem eveniet dicta nisi optio, fugiat provident iure mollitia placeat minima sequi! Magni corrupti impedit hic dicta ab vero officiis in atque doloremque recusandae, ea aliquid at debitis modi iste sint asperiores et cumque corporis tempora. Earum laudantium totam autem aliquid illo vel dignissimos error pariatur corrupti asperiores ex adipisci, illum voluptate eligendi, voluptatem quod nam suscipit itaque quibusdam at deleniti rem libero. Dolorum eos veniam voluptates minus debitis reprehenderit expedita tempora repudiandae quam. Consectetur necessitatibus porro numquam architecto consequuntur velit veritatis dignissimos doloremque sit fuga corrupti beatae tenetur sapiente id perspiciatis labore quos eligendi vitae dicta quod ab odio, repudiandae rerum. Similique velit numquam aperiam exercitationem consequuntur dolore mollitia fugit voluptatem beatae veritatis, iure odit blanditiis quod, enim neque, explicabo illum molestiae assumenda dignissimos. Illo sapiente officia tempore, deserunt minima, dolor animi distinctio dignissimos nesciunt numquam magni laudantium asperiores! Vero rem beatae voluptas quae maiores soluta inventore molestiae expedita perferendis aliquam officia totam minima quas laudantium reprehenderit, sequi voluptates rerum aliquid facilis aut? Eos, eligendi? At sunt corrupti nesciunt, laborum ex adipisci. Modi totam magnam aliquid libero velit quis asperiores sapiente. Minus dicta architecto natus doloribus voluptatibus corporis rerum commodi possimus quo pariatur! Nihil blanditiis nam amet dolores laborum sit necessitatibus eaque ducimus, alias, laboriosam hic expedita deserunt vel facilis numquam temporibus doloremque ab id cumque consectetur corporis minima nostrum. Dicta, molestias ullam doloribus voluptas nulla distinctio maiores neque natus libero qui! Neque eum tempora voluptate facilis reiciendis error accusamus! Maxime est vel recusandae, ullam ea blanditiis nostrum saepe voluptatem deleniti expedita accusamus mollitia. Saepe quae, sint et quo veritatis assumenda at blanditiis ut.</p> */}
    </section>
    
  );
}
